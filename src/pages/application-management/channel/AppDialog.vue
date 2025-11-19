<script setup lang="ts">
  import useVariables from "@/composables/useVariables";
  import useSnackbar from "@/composables/useSnackbar";
  import { reactive } from "vue";
  import { getAppList } from "@/service/analytics/app";
  import {
    setChannelApps,
    getChannelAppIds,
  } from "@/service/analytics/channel";

  const propItems = defineProps({
    types: {
      type: Array,
      default: () => [],
    },
  });

  const state = reactive({
    dialog: {
      isShowDialog: false,
      key: "",
      title: "",
      cancelText: "cancel",
      confirmText: "submit",
    },
    selected: [],
    appList: [] as EmptyArrayType,
    loading: false,
    item: {} as EmptyObjectType,
  });
  const { locale, mobile } = useVariables();
  const snackbar = useSnackbar();
  const form = ref();
  const emit = defineEmits(["refresh"]);
  const closeDialog = () => {
    state.dialog.isShowDialog = false;
  };

  const getAppId = async (item: EmptyObjectType) => {
    const request = {
      channelId: item.id,
    };
    const res = await getChannelAppIds(request);
    state.selected = res.data;
  };
  const getListApp = async () => {
    try {
      state.loading = false;
      const res = await getAppList({ page: 1, pageSize: 999 });
      state.appList = res.data.list;
    } catch (e) {
      console.log(e);
    }
  };
  const onSubmit = async () => {
    try {
      state.loading = true;
      const request = {
        channelId: state.item.id,
        appIds: state.selected,
      };
      const response = await setChannelApps(request);
      if (response.code == 0) {
        snackbar.showSnackbar(locale.t("saveSuccess"), "success", "top");
        state.dialog.isShowDialog = false;
      } else {
        snackbar.showSnackbar(response.msg, "error", "top");
      }
    } catch (error: any) {
      console.log(error);
      // snackbar.showSnackbar(error.message, "error", "top");
    } finally {
      state.loading = false;
    }
  };

  onMounted(() => {});
  defineExpose({
    open: (item: EmptyObjectType) => {
      state.dialog.isShowDialog = true;
      state.item = item;
      getAppId(item);
      getListApp();
    },
  });
</script>
<template>
  <v-dialog
    v-model="state.dialog.isShowDialog"
    scrollable
    max-width="750px"
    :fullscreen="mobile"
    @after-leave="closeDialog"
  >
    <v-card
      flat
      :loading="state.loading"
    >
      <v-card-title>
        <div class="d-flex justify-space-between align-center">
          {{ locale.t("applicationSetting") }}
          <v-btn
            color=""
            icon="mdi-close"
            size="small"
            @click="state.dialog.isShowDialog = false"
          />
        </div>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-row dense>
            <v-col cols="12">
              <div class="d-flex ga-5 mt-4 flex-wrap">
                <v-checkbox
                  v-for="(item, index) in state.appList"
                  :key="index"
                  v-model="state.selected"
                  :label="item.name"
                  :value="item.id"
                  hide-details
                  color="primary"
                  density="compact"
                />
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="grey"
          density="comfortable"
          @click="state.dialog.isShowDialog = false"
        >
          {{ locale.t(state.dialog.cancelText) }}
        </v-btn>
        <v-btn
          color="primary"
          density="comfortable"
          :loading="state.loading"
          @click="onSubmit"
        >
          {{ locale.t(state.dialog.confirmText) }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
