<script lang="ts" setup>
  import Table from "@/components/table/index.vue";
  import Dialog from "./dialog.vue";
  import useVariables from "@/composables/useVariables";
  import {
    getAdPositionList,
    deleteAdPosition,
  } from "@/service/analytics/adposition";
  import useSnackbar from "@/composables/useSnackbar";

  const { locale } = useVariables();
  const snackbar = useSnackbar();

  const state = reactive({
    table: {
      headers: [
        {
          title: computed(() => locale.t("id")),
          value: "ID",
          sortable: true,
        },
        {
          title: computed(() => locale.t("locationName")),
          value: "positionName",
          sortable: true,
        },
        {
          title: computed(() => locale.t("locationMaker")),
          value: "positionKey",
          sortable: true,
        },

        {
          title: computed(() => locale.t("promoteLink")),
          value: "promoteLink",
          sortable: true,
        },

        {
          title: computed(() => locale.t("createDate")),
          value: "CreatedAt",
          key: "date",
          sortable: false,
          width: "200px",
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
        pageSize: 10,
        keyword: "",
        positionName: "",
        positionKey: "",
      },
    },
  });

  const getDataTable = async () => {
    state.table.loading = true;
    try {
      const res = await getAdPositionList(state.table.config);
      state.table.items =
        res.data.list.map((item: EmptyObjectType) => ({
          ...item,
          image: item.logo,
        })) ?? [];
      state.table.total = res.data.total;
    } catch (e) {
      console.log(e);
    } finally {
      state.table.loading = false;
    }
  };

  const dialogRef = ref();
  const onUpdate = (options: any) => {
    state.table.config = options;
    getDataTable();
  };

  const onDelete = async (item: EmptyObjectType) => {
    const request = {
      id: item.ID,
    };
    const res = await deleteAdPosition(request);
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
      name: "",
      keyword: "",
      identifier: "",
      page: 1,
      pageSize: 10,
      startCreatedAt: "",
      updatedAt: "",
    };
    getDataTable();
  };
  const onSystem = (key: string, item: EmptyObjectType) => {
    if (key === "add" || key === "edit") {
      dialogRef.value.open(key, item);
    } else if (key === "delete") {
      onDelete(item);
    }
  };
  onMounted(() => {
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
            v-model="state.table.config.positionName"
            hide-details="auto"
            density="compact"
            clearable
            :label="locale.t('positionName')"
          />
        </v-col>
        <v-col
          cols="6"
          sm="6"
          md="4"
          lg="2"
        >
          <v-text-field
            v-model="state.table.config.positionKey"
            hide-details="auto"
            density="compact"
            :label="locale.t('positionKey')"
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
      :title="locale.t('adpositionManagement')"
      @system="onSystem"
      @update:options="onUpdate"
      @permission="openMenuPermission"
    />
    <Dialog
      ref="dialogRef"
      :items="state.table.items"
      @refresh="getDataTable"
    />
  </v-container>
</template>
