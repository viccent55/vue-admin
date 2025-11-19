<script lang="ts" setup>
  import Table from "@/components/table/index.vue";
  import Dialog from "./dialog.vue";
  import useVariables from "@/composables/useVariables";
  import { getProducts, deleteProduct } from "@/service/application/product";
  import useSnackbar from "@/composables/useSnackbar";

  const { locale } = useVariables();
  const snackbar = useSnackbar();

  const state = reactive({
    table: {
      headers: [
        {
          title: computed(() => locale.t("image")),
          value: "productImage",
          key: "image",
          sortable: false,
        },
        {
          title: computed(() => locale.t("productCode")),
          value: "productCode",
          sortable: false,
        },
        {
          title: computed(() => locale.t("productName")),
          value: "productName",
          sortable: true,
        },
        {
          title: computed(() => locale.t("productPrice")),
          value: "price",
          sortable: true,
        },
        {
          title: computed(() => locale.t("commissionRate")),
          value: "commissionRate",
          sortable: true,
        },
        {
          title: computed(() => locale.t("linkType")),
          value: "linkType",
          sortable: true,
        },
        {
          title: computed(() => locale.t("linkType")),
          value: "productUrl",
          sortable: true,
        },
        {
          title: computed(() => locale.t("productStatus")),
          value: "status",
          key: "status",
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
        startCommissionRate: null as null | number,
        endCommissionRate: null as null | number,
        endPrice: null as null | number,
        startPrice: null as null | number,
        startDate: "",
        endDate: "",
        productCode: "",
        productName: "",
        status: null as null | number,
      },
    },
    status: [
      {
        label: locale.t("removedFromShelves"),
        value: "2",
      },
      {
        label: locale.t("addedToShelves"),
        value: "1",
      },
    ],
    selected: [] as EmptyArrayType,
  });

  const getDataTable = async () => {
    state.table.loading = true;
    try {
      const { startDate, endDate, ...config } = state.table.config;

      // Build request payload, filtering out empty values
      const request: Record<string, any> = {};
      for (const key in config) {
        const value = config[key as keyof typeof config];
        if (value !== null && value !== "" && value !== undefined) {
          request[key] = value;
        }
      }

      // Add createdAtRange[]
      if (startDate || endDate) {
        request["createdAtRange"] = []; // ✅ no brackets in key name
        if (startDate)
          request["createdAtRange"].push(new Date(startDate).toISOString());
        if (endDate)
          request["createdAtRange"].push(new Date(endDate).toISOString());
      }

      // Send transformed request to API
      const res = await getProducts(request);
      state.table.items =
        res.data.list.map((item: EmptyObjectType) => ({
          ...item,
          option: true,
          icon: "mdi-information",
          image: item.productImage,
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
    const res = await deleteProduct(request);
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
      startCommissionRate: null as null | number,
      endCommissionRate: null as null | number,
      endPrice: null as null | number,
      startPrice: null as null | number,
      startDate: "",
      endDate: "",
      productCode: "",
      productName: "",
      status: null as null | number,
    };
    getDataTable();
  };
  const dialogInfoRef = ref();

  const onSystem = (key: string, item: EmptyObjectType) => {
    if (key === "add" || key === "edit") {
      dialogRef.value.open(key, item);
    } else if (key === "delete") {
      onDelete(item);
    } else if (key === "delete-selected") {
      // onDeleteSelected(item);
    } else if (key == "option") {
      dialogInfoRef.value.open(
        state.table.headers.filter((v) => v.key != "actions"),
        item
      );
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
          <DatePicker
            :placeholder="locale.t('startDate')"
            @change="(v) => (state.table.config.startDate = v)"
          />
        </v-col>
        <v-col
          cols="6"
          sm="6"
          md="4"
          lg="2"
        >
          <DatePicker
            :placeholder="locale.t('endDate')"
            :min-date="state.table.config.startDate"
            @change="(v) => (state.table.config.endDate = v)"
          />
        </v-col>
        <v-col
          cols="6"
          sm="6"
          md="4"
          lg="2"
        >
          <v-text-field
            v-model="state.table.config.productCode"
            :placeholder="locale.t('productCode')"
            variant="outlined"
            density="compact"
            clearable
            hide-details
          />
        </v-col>
        <v-col
          cols="6"
          sm="6"
          md="4"
          lg="2"
        >
          <v-text-field
            v-model="state.table.config.productName"
            :placeholder="locale.t('productName')"
            variant="outlined"
            density="compact"
            clearable
            hide-details
          />
        </v-col>
        <v-col
          cols="6"
          sm="6"
          md="4"
          lg="2"
        >
          <v-text-field
            v-model="state.table.config.startPrice"
            :placeholder="locale.t('startPrice')"
            variant="outlined"
            density="compact"
            clearable
            type="number"
            hide-details
          />
        </v-col>
        <v-col
          cols="6"
          sm="6"
          md="4"
          lg="2"
        >
          <v-text-field
            v-model="state.table.config.endPrice"
            :placeholder="locale.t('endPrice')"
            variant="outlined"
            density="compact"
            clearable
            type="number"
            hide-details
          />
        </v-col>
        <v-col
          cols="6"
          sm="6"
          md="4"
          lg="2"
        >
          <v-text-field
            v-model="state.table.config.startCommissionRate"
            :placeholder="locale.t('startCommissionRate')"
            variant="outlined"
            density="compact"
            clearable
            type="number"
            hide-details
          />
        </v-col>
        <v-col
          cols="6"
          sm="6"
          md="4"
          lg="2"
        >
          <v-text-field
            v-model="state.table.config.endCommissionRate"
            :placeholder="locale.t('endCommissionRate')"
            variant="outlined"
            density="compact"
            clearable
            type="number"
            hide-details
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
            item-title="label"
            item-value="value"
            :placeholder="locale.t('productStatus')"
            variant="outlined"
            density="compact"
            clearable
            type="text"
            hide-details
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
      :title="locale.t('productManagment')"
      :show-select="false"
      @system="onSystem"
      @update:options="onUpdate"
      @permission="openMenuPermission"
      @selected="(v) => (state.selected = v)"
    />
    <Dialog
      ref="dialogRef"
      :status="state.status"
      @refresh="getDataTable"
    />
    <DisplayInfo ref="dialogInfoRef" />
  </v-container>
</template>
