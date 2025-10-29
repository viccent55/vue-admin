<script lang="ts" setup>
  import Table from "@/components/role/table.vue";
  import Dialog from "./dialog.vue";
  import DialogPermission from "./DialogPermission.vue";
  import useVariables from "@/composables/useVariables";
  import { roles, deleteItem } from "@/service/role";
  import useSnackbar from "@/composables/useSnackbar";

  const { locale } = useVariables();
  const snackbar = useSnackbar();

  const state = reactive({
    headers: [
      {
        title: "",
        key: "data-table-expand",
        sortable: false,
      },
      {
        title: computed(() => locale.t("authorityId")),
        key: "authorityId",
        sortable: true,
      },
      {
        title: computed(() => locale.t("authorityName")),
        key: "authorityName",
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
      page: 1,
      itemsPerPage: 10,
      keyword: "",
      sortBy: "",
    },
  });

  const getDataTable = async () => {
    state.loading = true;
    try {
      const res = await roles(state.config);
      state.items = res.data ?? [];
      state.total = res.data.total;
    } catch (e) {
      console.log(e);
    } finally {
      state.loading = false;
    }
  };

  const dialogRef = ref();
  const onUpdate = (options: any) => {
    state.config = options;
    getDataTable();
  };

  const openDialog = (key: string, item: EmptyObjectType) => {
    dialogRef.value.open(key, item);
  };
  const onDelete = async (item: EmptyObjectType) => {
    const res = await deleteItem(item);
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
  onMounted(() => {
    getDataTable();
  });
</script>
<template>
  <v-container fluid>
    <Table
      :headers="state.headers"
      :items="state.items"
      :total-items="state.total"
      :loading="state.loading"
      :title="locale.t('rolesManagement')"
      @add="openDialog('add', {})"
      @edit="(v) => openDialog('edit', v)"
      @delete="onDelete"
      @update:options="onUpdate"
      @permission="openMenuPermission"
    />
    <Dialog
      ref="dialogRef"
      :items="state.items"
      @refresh="getDataTable"
    />
    <DialogPermission
      ref="dialogPermissionRef"
      :roles="state.items"
      @refresh="getDataTable"
    />
  </v-container>
</template>
