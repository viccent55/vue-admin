<script lang="ts" setup>
  import Dialog from "./dialog.vue";
  import Table from "@/components/table/index.vue";
  import useVariables from "@/composables/useVariables";
  import { menus } from "@/service/menu";

  const state = reactive({
    headers: [
      { title: "ID", key: "id", sortable: true },
      { title: "Name", key: "name", sortable: true },
      { title: "Email", key: "email", sortable: true },
      { title: "Role", key: "role" },
      { title: "Actions", key: "actions", sortable: false },
    ],
    items: [
      { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
    ],
    loading: false,
    config: {
      page: 1,
      itemsPerPage: 10,
      keyword: "",
      sortBy: "",
    },
  });
  const { locale } = useVariables();

  const getDataTable = async () => {
    state.loading = true;
    try {
      const res = await menus(state.config);

      console.log(res);
    } catch (e) {
      console.log(e);
    } finally {
      state.loading = false;
    }
  };

  const dialogRef = ref();

  function onAdd() {
    alert("Add new item");
  }
  function onEdit(item: any) {
    alert("Edit: " + item.name);
  }
  const onDelete = async (item: EmptyObjectType) => {
    alert("Delete: " + item.name);
  };

  onMounted(() => {
    getDataTable();
  });
</script>
<template>
  <v-container>
    <Table
      :headers="state.headers"
      :items="state.items"
      :total-items="state.items.length"
      :title="locale.t('menuManagement')"
      @add="onAdd"
      @edit="onEdit"
      @delete="onDelete"
    />
    <Dialog ref="dialogRef" />
  </v-container>
</template>
