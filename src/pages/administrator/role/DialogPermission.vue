<script setup lang="ts">
  import useVariables from "@/composables/useVariables";
  import useSnackbar from "@/composables/useSnackbar";
  import {
    getMenuAuthority,
    setDataAuthority,
  } from "@/service/admin/authority";
  import { getAllApis } from "@/service/admin/sysapi";
  import { getPolicyPathByAuthorityId, updateCasbin } from "@/service/casbin";
  import { getBaseMenuTree, addMenu } from "@/service/admin/menu";

  import TreeSelect from "@/components/TreeSelect.vue";
  import { apisToTree, flattenArray } from "@/hooks/helper";

  const props = defineProps({
    roles: {
      type: Array,
      default: () => [],
    },
  });

  const state = reactive({
    dialog: {
      isShowDialog: false,
      key: "",
      title: "roleConfiguration",
      cancelText: "cancel",
      confirmText: "submit",
    },
    tab: "menu",
    form: {} as EmptyObjectType,
    row: {} as EmptyObjectType,
    selectedRoles: [],
    selectedMenus: [] as EmptyArrayType,
    selectedApis: [] as EmptyArrayType,
    rules: {
      authorityName: [(v: string) => !!v || locale.t("fieldIsRequired")],
      authorityId: [
        (v: string) => !!v || locale.t("fieldIsRequired"),
        (v: string) => /^\d+$/.test(v) || locale.t("mustBeANumber"),
      ],
    },
    loading: false,
    parentItem: {
      authorityId: 0,
      authorityName: "",
    },
    baseMenus: [] as EmptyArrayType,
    menus: [] as EmptyArrayType,
    api: {
      toTreeData: [] as EmptyArrayType,
      apis: [] as EmptyArrayType,
    },
    policies: [],
  });
  const { locale, mobile } = useVariables();
  const snackbar = useSnackbar();
  const emit = defineEmits(["refresh"]);

  // Helper to convert flat API list to a tree structure for TreeSelect

  const getAllAuthories = async () => {
    try {
      state.loading = true;
      state.baseMenus = [];

      const request = { authorityId: state.form.authorityId };
      // Run all 3 at once
      const [resBaseMenu, resMenu, resApi, resPolicy] = await Promise.all([
        getBaseMenuTree({}),
        getMenuAuthority(request),
        getAllApis(request),
        getPolicyPathByAuthorityId(request),
      ]);

      // Assign results
      state.baseMenus = resBaseMenu.data.menus;
      // Get IDs of selected menus from the authority-specific endpoint
      const selectedMenuIds = flattenArray(resMenu.data.menus ?? []).map(
        (m: any) => m.ID
      );
      state.selectedMenus = selectedMenuIds;
      state.api.apis = resApi.data.apis ?? [];
      state.api.toTreeData = apisToTree(resApi.data.apis ?? []);
      state.policies = resPolicy.data.paths ?? [];
      state.selectedApis = state.policies?.map((item: any) => item.path);
    } catch (e) {
      console.error("Error fetching authorities:", e);
    } finally {
      state.loading = false;
    }
  };

  const open = async (item: EmptyObjectType) => {
    state.dialog.isShowDialog = true;

    state.form = item;
    state.selectedRoles = item.dataAuthorityId?.map(
      (item: any) => item.authorityId
    );
    await getAllAuthories();
  };

  const closeDialog = () => {
    state.dialog.isShowDialog = false;
    state.selectedMenus = [];
    state.selectedApis = [];
    state.selectedRoles = [];

    emit("refresh");
  };
  const onSubmit = async () => {
    try {
      state.loading = true;
      if (state.tab === "menu") {
        const allMenus = flattenArray(state.baseMenus);
        const selectedMenuObjects = allMenus.filter((menu: any) =>
          state.selectedMenus.includes(menu.ID)
        );
        const request = {
          authorityId: state.form.authorityId,
          menus: selectedMenuObjects,
        };
        const response = await addMenu(request);

        if (response.code == 0) {
          snackbar.showSnackbar(locale.t("updateSuccess"), "success", "top");
          closeDialog();
        } else {
          snackbar.showSnackbar(response.msg, "error", "top");
        }
      } else if (state.tab === "api") {
        const filtered = state.selectedApis.filter(
          (p) => !p.startsWith("group:")
        );

        const newApis = filtered.map((item) => {
          const findItem = state.api.apis.find((api) => api.path === item);
          return {
            path: findItem?.path,
            method: findItem?.method,
          };
        });

        const request = {
          authorityId: state.form.authorityId,
          casbinInfos: newApis,
        };

        const response = await updateCasbin(request);
        if (response.code == 0) {
          snackbar.showSnackbar(locale.t("updateSuccess"), "success", "top");
          closeDialog();
        } else {
          snackbar.showSnackbar(response.msg, "error", "top");
        }
      } else if (state.tab === "resource") {
        const resources = state.selectedRoles.map((authorityId: number) => {
          const findItem = displayRoles.value.find(
            (item) => authorityId == item.authorityId
          );
          return {
            authorityId: findItem?.authorityId,
            authorityName: findItem?.authorityName,
          };
        });

        const request = {
          ...state.form,
          dataAuthorityId: resources,
        };
        const response = await setDataAuthority(request);
        if (response.code == 0) {
          snackbar.showSnackbar(locale.t("updateSuccess"), "success", "top");
          closeDialog();
        } else {
          snackbar.showSnackbar(response.msg, "error", "top");
        }
      }
    } catch (error: any) {
      console.log(error);
      // snackbar.showSnackbar(error.message, "error", "top");
    } finally {
      state.loading = false;
    }
  };
  const displayRoles = computed(() => flattenArray(props.roles));
  const displayMenus = computed(() => {
    return (
      state.baseMenus.map((item: EmptyObjectType) => ({
        ...item,
        title: item.meta.title,
        children: item.children?.map((child: EmptyObjectType) => ({
          ...child,
          title: child.meta.title,
        })),
      })) ?? []
    );
  });
  defineExpose({
    open,
  });
</script>
<template>
  <v-dialog
    v-model="state.dialog.isShowDialog"
    scrollable
    max-width="750px"
    :fullscreen="mobile"
    min-height="500px"
  >
    <v-card
      flat
      :loading="state.loading"
    >
      <v-card-title>
        <div class="d-flex justify-space-between align-center">
          {{ locale.t(state.dialog.title) }}
          <v-btn
            color=""
            icon="mdi-close"
            size="small"
            @click="state.dialog.isShowDialog = false"
          />
        </div>
      </v-card-title>
      <v-card-text>
        <!-- {{ state.row }} -->
        <v-tabs v-model="state.tab">
          <v-tab value="menu">
            {{ locale.t("menu") }}
          </v-tab>
          <v-tab value="api">
            {{ locale.t("apiManagement") }}
          </v-tab>
          <v-tab value="resource">
            {{ locale.t("resourcePermission") }}
          </v-tab>
        </v-tabs>
        <v-window v-model="state.tab">
          <!-- {{ state.menus }} -->
          <v-window-item value="menu">
            <TreeSelect
              id="ID"
              v-model="state.selectedMenus"
              title="title"
              :items="displayMenus"
              open-all
              :loading="state.loading"
            />
          </v-window-item>
          <v-window-item value="api">
            <TreeSelect
              id="path"
              v-model:model-value="state.selectedApis"
              :items="state.api.toTreeData"
              title="description"
              type="api"
              open-all
              :is-loading="state.loading"
            />
          </v-window-item>
          <v-window-item value="resource">
            <div class="d-flex ga-5 mt-4 flex-wrap">
              <v-checkbox
                v-for="(item, index) in displayRoles"
                :key="index"
                v-model="state.selectedRoles"
                :label="item.authorityName"
                :value="item.authorityId"
                hide-details
                color="primary"
                density="compact"
              />
            </div>
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <div class="d-flex ga-2 px-3">
          <v-btn
            color="grey"
            variant="elevated"
            @click="state.dialog.isShowDialog = false"
          >
            {{ locale.t(state.dialog.cancelText) }}
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            :loading="state.loading"
            @click="onSubmit"
          >
            {{ locale.t(state.dialog.confirmText) }}
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
