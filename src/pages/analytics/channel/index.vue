<script lang="ts" setup>
  import Table from "@/components/table/index.vue";
  import Dialog from "./dialog.vue";
  import useVariables from "@/composables/useVariables";
  import { getChannelList, deleteChannel } from "@/service/analytics/channel";
  import useSnackbar from "@/composables/useSnackbar";
  import AppDialog from "./AppDialog.vue";

  const { locale } = useVariables();
  const snackbar = useSnackbar();
  const state = reactive({
    table: {
      headers: [
        {
          title: computed(() => locale.t("accountName")),
          value: "account",
          sortable: true,
        },
        {
          title: computed(() => locale.t("channelName")),
          value: "name",
          sortable: true,
        },

        {
          title: computed(() => locale.t("promotionType")),
          value: "channelType",
          sortable: true,
        },
        {
          title: computed(() => locale.t("status")),
          value: "status",
          key: "status",
          sortable: false,
          width: "200px",
        },
        {
          title: computed(() => locale.t("remark")),
          value: "remark",
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
        name: "",
        status: "",
        channelType: "",
        account: "",
      },
    },
    promotionTypes: ["CPA", "CPC", "CPM", "CPT", "CPS"],
  });

  const getDataTable = async () => {
    state.table.loading = true;
    try {
      const res = await getChannelList(state.table.config);
      state.table.items =
        res.data.list.map((item: EmptyObjectType) => ({
          ...item,
          image: item.logo,
          option: true,
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
    const res = await deleteChannel(request);
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
      name: "",
      status: "",
      channelType: "",
      account: "",
    };
    getDataTable();
  };
  const appDialogRef = ref();
  const onSystem = (key: string, item: EmptyObjectType) => {
    if (key === "add" || key === "edit") {
      dialogRef.value.open(key, item);
    } else if (key === "delete") {
      onDelete(item);
    } else if (key === "option") {
      appDialogRef.value.open(item);
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
            v-model="state.table.config.account"
            hide-details="auto"
            density="compact"
            :label="locale.t('channelAccount')"
            clearable
          />
        </v-col>
        <v-col
          cols="6"
          sm="6"
          md="4"
          lg="2"
        >
          <v-text-field
            v-model="state.table.config.name"
            hide-details="auto"
            density="compact"
            :label="locale.t('channelName')"
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
            v-model="state.table.config.channelType"
            :items="state.promotionTypes"
            :label="locale.t('promotionType')"
            :placeholder="locale.t('promotionType')"
            hide-details="auto"
            density="compact"
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
            :items="[
              {
                title: locale.t('enable'),
                value: 1,
              },
              {
                title: locale.t('disable'),
                value: 0,
              },
            ]"
            :label="locale.t('status')"
            item-title="title"
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
      :title="locale.t('channelManagement')"
      @system="onSystem"
      @update:options="onUpdate"
      @permission="openMenuPermission"
    />

    <Dialog
      ref="dialogRef"
      :types="state.promotionTypes"
      @refresh="getDataTable"
    />
    <AppDialog
      ref="appDialogRef"
      @refresh="getDataTable"
    />
  </v-container>
</template>
