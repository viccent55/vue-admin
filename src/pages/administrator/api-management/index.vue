<script lang="ts" setup>
  import Table from "@/components/table/index.vue";
  import Dialog from "./dialog.vue";
  import useVariables from "@/composables/useVariables";
  import { getApiList, deleteItem, apiGroup } from "@/service/admin/sysapi";
  import useSnackbar from "@/composables/useSnackbar";

  const { locale } = useVariables();
  const snackbar = useSnackbar();

  const state = reactive({
    table: {
      headers: [
        {
          title: computed(() => locale.t("id")),
          key: "ID",
          sortable: false,
        },
        {
          title: computed(() => locale.t("apiPath")),
          key: "path",
          sortable: true,
        },
        {
          title: computed(() => locale.t("apiGroup")),
          key: "apiGroup",
          sortable: true,
        },
        {
          title: computed(() => locale.t("apiDescription")),
          key: "description",
          sortable: true,
        },
        {
          title: computed(() => locale.t("method")),
          key: "method",
          sortable: true,
        },
        {
          title: computed(() => locale.t("action")),
          key: "actions",
          sortable: false,
          width: "200px",
        },
      ],
      items: [],
      total: 0,
      loading: false,
      config: {
        keyword: "",
        sortBy: "",
        page: 1,
        pageSize: 10,
        apiGroup: null,
        description: "",
        method: null,
        path: "",
      },
    },
    groups: [],
    apiGroupMap: {},
    methods: [
      {
        value: "GET",
        label: locale.t("view") + " (Get)",
      },
      {
        value: "POST",
        label: locale.t("create") + " (Create)",
      },
      {
        value: "PUT",
        label: locale.t("update") + " (Update)",
      },
      {
        value: "DELETE",
        label: locale.t("delete") + " (Delete)",
      },
    ],
  });

  const getApiGroups = async () => {
    const res = await apiGroup();
    state.apiGroupMap = res.data.apiGroupMap;
    state.groups = res.data?.groups ?? [];
  };
  const getDataTable = async () => {
    state.table.loading = true;
    try {
      const request = {
        apiGroup: state.table.config.apiGroup,
        description: state.table.config.description,
        method: state.table.config.method,
        path: state.table.config.path,
        page: state.table.config.page,
        pageSize: state.table.config.pageSize,
      };
      const res = await getApiList(request);
      state.table.items = res.data.list ?? [];
      state.table.total = res.data.total;
    } catch (e) {
      console.log(e);
    } finally {
      state.table.loading = false;
    }
  };

  const dialogRef = ref();
  const onUpdate = (options: any) => {
    console.log("update option", options);
    state.table.config = options;
    getDataTable();
  };

  const openDialog = (key: string, item: EmptyObjectType = {}) => {
    dialogRef.value.open(key, item);
  };
  const onDelete = async (item: EmptyObjectType) => {
    const request = {
      ids: [item.ID],
    };
    const res = await deleteItem(request);
    if (res.code === 0) {
      getDataTable();
      snackbar.showSnackbar(locale.t("deleteSuccess"), "success", "top");
    } else {
      snackbar.showSnackbar(res.msg, "error", "top");
    }
  };
  const dialogPermissionRef = ref();
  const openMenuPermission = async (item: EmptyObjectType) => {
    dialogPermissionRef.value.open(item);
  };
  const resetQuery = () => {
    state.table.config = {
      keyword: "",
      sortBy: "",
      page: 1,
      pageSize: 10,
      apiGroup: null,
      description: "",
      method: null,
      path: "",
    };
    getDataTable();
  };
  const onSystem = (key: string, item: EmptyObjectType) => {
    if (key === "add") {
      openDialog(key);
    } else if (key === "edit") {
      openDialog(key, item);
    } else if (key === "delete") {
      onDelete(item);
    }
  };
  onMounted(() => {
    getApiGroups();
    getDataTable();
  });
</script>
<template>
  <v-container fluid>
    <v-form
      ref="form"
      class="py-5"
    >
      <v-row>
        <v-col
          cols="6"
          sm="6"
          md="4"
          lg="2"
        >
          <v-text-field
            v-model="state.table.config.path"
            hide-details="auto"
            density="compact"
            clearable
            :label="locale.t('path')"
          />
        </v-col>
        <v-col
          cols="6"
          sm="6"
          md="4"
          lg="2"
        >
          <v-text-field
            v-model="state.table.config.description"
            hide-details="auto"
            density="compact"
            :label="locale.t('description')"
            clearable
          />
        </v-col>
        <v-col
          cols="6"
          sm="6"
          md="4"
          lg="2"
        >
          <v-select
            v-model="state.table.config.apiGroup"
            hide-details="auto"
            density="compact"
            :items="state.groups"
            :label="locale.t('apiGroup')"
            clearable
          />
        </v-col>
        <v-col
          cols="6"
          sm="6"
          md="4"
          lg="2"
        >
          <v-select
            v-model="state.table.config.method"
            :items="state.methods"
            :label="locale.t('method')"
            item-title="label"
            item-value="value"
            hide-details="auto"
            density="compact"
            clearable
          />
        </v-col>
        <v-col
          cols="6"
          sm="12"
          md="6"
          lg="auto"
        >
          <v-btn
            color="secondary"
            @click="getDataTable"
          >
            <div class="d-flex align-center ga-2">
              {{ locale.t("search") }}
              <v-icon>mdi-magnify</v-icon>
            </div>
          </v-btn>
          <v-btn
            class="ml-2"
            color="primary"
            @click="resetQuery"
          >
            <div class="d-flex align-center ga-2">
              {{ locale.t("refresh") }}
              <v-icon>mdi-refresh</v-icon>
            </div>
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <Table
      v-bind="state.table"
      :title="locale.t('apiManagement')"
      @system="onSystem"
      @update:options="onUpdate"
      @permission="openMenuPermission"
    />
    <Dialog
      ref="dialogRef"
      :items="state.table.items"
      :methods="state.methods"
      :groups="state.groups"
      @refresh="getDataTable"
    />
  </v-container>
</template>
