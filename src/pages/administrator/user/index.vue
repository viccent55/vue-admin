<script lang="ts" setup>
  import Table from "@/components/table/index.vue";
  import Dialog from "./dialog.vue";
  import useVariables from "@/composables/useVariables";
  import { getUserList, deleteItem } from "@/service/user";
  import useSnackbar from "@/composables/useSnackbar";
  import { roles } from "@/service/role";

  const { locale } = useVariables();
  const snackbar = useSnackbar();

  const state = reactive({
    table: {
      headers: [
        {
          title: computed(() => locale.t("avatar")),
          value: "headerImg",
          key: "image",
          sortable: false,
        },
        {
          title: computed(() => locale.t("id")),
          key: "ID",
          sortable: true,
        },
        {
          title: computed(() => locale.t("username")),
          key: "userName",
          sortable: true,
        },
        {
          title: computed(() => locale.t("phone")),
          key: "phone",
          sortable: true,
        },
        {
          title: computed(() => locale.t("email")),
          key: "email",
          sortable: true,
        },
        {
          title: computed(() => locale.t("enable")),
          value: "enable",
          key: "enable",
          sortable: false,
        },
        {
          title: computed(() => locale.t("userRole")),
          value: "authorities",
          key: "select",
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
        email: "",
        keyword: "",
        nickname: "",
        page: 1,
        pageSize: 10,
        phone: "",
        username: "",
      },
    },
    roles: [],
  });

  const getRoles = async () => {
    try {
      const res = await roles({});
      state.roles = res.data ?? [];
    } catch (e) {
      console.log(e);
    } finally {
      // state.loading = false;
    }
  };

  const getDataTable = async () => {
    state.table.loading = true;
    try {
      const res = await getUserList(state.table.config);
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
    state.table.config = options;
    getDataTable();
  };

  const openDialog = (key: string, item: EmptyObjectType) => {
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
      email: "",
      keyword: "",
      nickname: "",
      page: 1,
      pageSize: 10,
      phone: "",
      username: "",
    };
    getDataTable();
  };
  onMounted(() => {
    getRoles();
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
          col="6"
          sm="6"
          md="4"
          lg="2"
        >
          <v-text-field
            v-model="state.table.config.username"
            hide-details="auto"
            density="compact"
            clearable
            :label="locale.t('username')"
          />
        </v-col>
        <v-col
          col="6"
          sm="6"
          md="4"
          lg="2"
        >
          <v-text-field
            v-model="state.table.config.nickname"
            hide-details="auto"
            density="compact"
            :label="locale.t('nickName')"
            clearable
          />
        </v-col>
        <v-col
          col="6"
          sm="6"
          md="4"
          lg="2"
        >
          <v-text-field
            v-model="state.table.config.phone"
            hide-details="auto"
            density="compact"
            :label="locale.t('phone')"
            clearable
          />
        </v-col>
        <v-col
          col="6"
          sm="6"
          md="4"
          lg="2"
        >
          <v-text-field
            v-model="state.table.config.email"
            :label="locale.t('email')"
            hide-details="auto"
            density="compact"
            clearable
          />
        </v-col>
        <v-col
          col="6"
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
      :title="locale.t('usersManagement')"
      @add="openDialog('add', {})"
      @edit="(v) => openDialog('edit', v)"
      @delete="onDelete"
      @update:options="onUpdate"
      @permission="openMenuPermission"
    />
    <Dialog
      ref="dialogRef"
      :items="state.table.items"
      :roles="state.roles"
      @refresh="getDataTable"
    />
  </v-container>
</template>
