<script setup lang="ts">
  import useVariables from "@/composables/useVariables";
  import useSnackbar from "@/composables/useSnackbar";
  import { reactive } from "vue";
  import {
    createChannel,
    getParentChannelList,
    updateChannel,
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
    form: {
      account: "",
      password: "",
      name: "",
      parentId: null,
      channelType: "CPA",
      remark: "",
      status: 1,
    },
    rules: {
      account: [(v: string) => !!v || locale.t("fieldIsRequired")],
      password: [(v: string) => !!v || locale.t("fieldIsRequired")],
      name: [(v: string) => !!v || locale.t("fieldIsRequired")],
      channelType: [(v: string) => !!v || locale.t("fieldIsRequired")],
    },
    loading: false,
    visible: false,
    channels: [],
  });
  const { locale, mobile } = useVariables();
  const snackbar = useSnackbar();
  const form = ref();
  const emit = defineEmits(["refresh"]);
  const closeDialog = () => {
    state.dialog.isShowDialog = false;
    form.value.reset();
    state.form.status = 1;
  };
  const onSubmit = async () => {
    const { valid } = await form.value.validate();
    if (!valid) return;
    try {
      state.loading = true;
      const response =
        state.dialog.key == "add"
          ? await createChannel(state.form)
          : await updateChannel(state.form);
      if (response.code == 0) {
        snackbar.showSnackbar(locale.t("saveSuccess"), "success", "top");
        state.dialog.isShowDialog = false;
        emit("refresh");
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
  const displayChannel = computed(() => {
    return [
      {
        id: 0,
        name: locale.t("root"),
      },
      ...state.channels,
    ];
  });
  onMounted(() => {
    getParentChannelList().then((res) => {
      console.log(res);
      state.channels = res.data ?? [];
    });
  });
  defineExpose({
    open: (key: string, item: EmptyObjectType) => {
      state.dialog.isShowDialog = true;
      state.dialog.key = key;
      if (key == "edit") {
        Object.assign(state.form, item);
      }
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
          {{ locale.t(state.dialog.key) }}
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
              <div>
                <span class="text-error">*</span>
                {{ locale.t("channelAccount") }}
              </div>
              <v-text-field
                v-model="state.form.account"
                :rules="state.rules.account"
                :placeholder="locale.t('channelAccount')"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12">
              <div>
                <span class="text-error">*</span>
                {{ locale.t("password") }}
              </div>
              <v-text-field
                v-model="state.form.password"
                :rules="state.rules.password"
                :placeholder="locale.t('password')"
                variant="outlined"
                prepend-inner-icon="mdi-lock"
                density="compact"
                :type="state.visible ? 'text' : 'password'"
                :append-inner-icon="state.visible ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="state.visible = !state.visible"
              />
            </v-col>
            <v-col cols="12">
              <div>
                <span class="text-error">*</span>
                {{ locale.t("channelName") }}
              </div>
              <v-text-field
                v-model="state.form.name"
                :rules="state.rules.name"
                :placeholder="locale.t('channelName')"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
            <v-col cols="12">
              <div>
                {{ locale.t("parentName") }}
              </div>
              <v-select
                v-model="state.form.parentId"
                :items="displayChannel"
                item-title="name"
                item-value="id"
                :placeholder="locale.t('parentName')"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
            <v-col
              cols="6"
              md="6"
            >
              <div>
                {{ locale.t("channelPromotion") }}
              </div>
              <v-select
                v-model.number="state.form.channelType"
                :rules="state.rules.channelType"
                :items="types"
                :placeholder="locale.t('channelName')"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col
              cols="6"
              md="6"
            >
              <div
                class="d-flex flex-column ga-2 align-start ml-2 items-center"
              >
                <div>
                  {{ locale.t("enable") }}
                </div>
                <v-switch
                  v-model="state.form.status"
                  hide-details
                  :true-value="1"
                  :false-value="2"
                  inset
                  class="switch-toggle"
                  density="compact"
                />
              </div>
            </v-col>
            <v-col cols="12">
              <div>
                {{ locale.t("remark") }}
              </div>
              <v-textarea
                v-model="state.form.remark"
                :placeholder="locale.t('remark')"
                variant="outlined"
                density="compact"
                rows="2"
              />
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
