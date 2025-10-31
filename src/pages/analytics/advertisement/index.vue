<script lang="ts" setup>
  import Table from "@/components/table/index.vue";
  import Dialog from "./dialog.vue";
  import useVariables from "@/composables/useVariables";
  import { getAppList } from "@/service/analytics/app";
  import { getAdPositionList } from "@/service/analytics/adposition";
  import {
    getAppAdPositionList,
    deleteAdvertisment,
  } from "@/service/analytics/advertisment";

  import useSnackbar from "@/composables/useSnackbar";

  const { locale } = useVariables();
  const snackbar = useSnackbar();

  const state = reactive({
    table: {
      headers: [
        {
          title: computed(() => locale.t("id")),
          value: "id",
          sortable: false,
        },
        {
          title: computed(() => locale.t("image")),
          value: "adPositionImage",
          key: "image",
          sortable: true,
        },
        {
          title: computed(() => locale.t("applicationName")),
          value: "appName",
          sortable: true,
        },
        {
          title: computed(() => locale.t("adpositionName")),
          value: "positionName",
          sortable: true,
        },
        {
          title: computed(() => locale.t("link")),
          value: "adPositionLink",
          sortable: true,
        },
        {
          title: computed(() => locale.t("status")),
          value: "adPositionLink",
          key: "statusOption",
          sortable: true,
        },
        {
          title: computed(() => locale.t("reviewBy")),
          value: "reviewerName",
          sortable: true,
        },
        {
          title: computed(() => locale.t("totalClick")),
          value: "clickTotal",
          sortable: true,
        },
        {
          title: computed(() => locale.t("monthlyClick")),
          value: "clickMonthly",
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
        keyword: "",
        page: 1,
        pageSize: 10,
        appId: null,
        adPositionId: null,
        status: "",
      },
    },
    applicationList: [] as EmptyArrayType,
    advertismentList: [] as EmptyArrayType,
    status: [
      {
        title: locale.t("all"),
        value: "",
      },
      {
        title: locale.t("pending"),
        value: "0",
      },
      {
        title: locale.t("reviewed"),
        value: "1",
      },
      {
        title: locale.t("rejected"),
        value: "2",
      },
    ],
  });

  const initApp = async () => {
    try {
      const [{ data: appRes }, { data: adRes }] = await Promise.all([
        getAppList({ page: 1, pageSize: 1000 }),
        getAdPositionList({ page: 1, pageSize: 1000 }),
      ]);
      state.applicationList = appRes?.list ?? [];
      state.advertismentList = adRes?.list ?? [];
    } catch (err) {
      console.error("Failed to load init data:", err);
    }
  };
  const getDataTable = async () => {
    state.table.loading = true;
    try {
      const res = await getAppAdPositionList(state.table.config);
      state.table.items =
        res.data.list.map((item: EmptyObjectType) => ({
          ...item,
          image: item.adPositionImage,
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
      id: item.id,
    };
    const res = await deleteAdvertisment(request);
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
      page: 1,
      pageSize: 10,
      appId: null,
      adPositionId: null,
      status: "",
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
    initApp();
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
          <v-select
            v-model="state.table.config.appId"
            :items="state.applicationList"
            item-title="name"
            item-value="id"
            hide-details="auto"
            density="compact"
            clearable
            :label="locale.t('applicationName')"
          />
        </v-col>
        <v-col
          cols="6"
          sm="6"
          md="4"
          lg="2"
        >
          <v-select
            v-model="state.table.config.adPositionId"
            :items="state.advertismentList"
            item-title="positionName"
            item-value="ID"
            hide-details="auto"
            density="compact"
            :label="locale.t('adpositionName')"
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
            v-model="state.table.config.status"
            :items="state.status"
            item-title="title"
            item-value="value"
            hide-details="auto"
            density="compact"
            :label="locale.t('status')"
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
      :title="locale.t('advertismentManagement')"
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
