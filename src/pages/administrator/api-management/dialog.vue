<script setup lang="ts">
  import useVariables from "@/composables/useVariables";
  import { createApi, updateApi } from "@/service/admin/sysapi";
  import useSnackbar from "@/composables/useSnackbar";

  const props = defineProps({
    methods: {
      type: Array,
      default: () => [],
    },
    groups: {
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
      ID: null,
      path: null,
      description: "",
      method: "",
      apiGroup: "",
    },
    rules: {
      path: [(v: string) => !!v || locale.t("fieldIsRequired")],
      description: [(v: string) => !!v || locale.t("fieldIsRequired")],
      method: [(v: string) => !!v || locale.t("fieldIsRequired")],
      apiGroup: [(v: string) => !!v || locale.t("fieldIsRequired")],
    },
    loading: false,
    parentItem: {
      authorityId: 0,
      authorityName: "",
    },
  });
  const { locale, mobile } = useVariables();
  const snackbar = useSnackbar();
  const form = ref();
  const emit = defineEmits(["refresh"]);

  const open = (key: string, item: EmptyObjectType) => {
    state.dialog.isShowDialog = true;
    state.dialog.key = key;

    if (key == "add") {
      nextTick(() => {
        form.value.reset();
      });
    } else if (key == "edit") {
      Object.assign(state.form, item);
    }
  };

  const closeDialog = () => {
    state.dialog.isShowDialog = false;
    emit("refresh");
  };
  const onSubmit = async () => {
    const { valid } = await form.value.validate();
    if (!valid) return;
    try {
      state.loading = true;
      const request = {
        ID: 0,
        apiGroup: state.form.apiGroup,
        description: state.form.description,
        method: state.form.method,
        path: state.form.path,
      };
      const response =
        state.dialog.key == "add"
          ? await createApi(request)
          : await updateApi(state.form);
      if (response.code == 0) {
        snackbar.showSnackbar(locale.t("createSuccess", "success", "top"));
        closeDialog();
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
  defineExpose({
    open,
  });
</script>
<template>
  <v-dialog
    v-model="state.dialog.isShowDialog"
    scrollable
    max-width="750px"
    :fullscreen="mobile"
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
                {{ locale.t("path") }}
              </div>
              <v-text-field
                v-model.number="state.form.path"
                :rules="state.rules.path"
                :placeholder="locale.t('path')"
                variant="outlined"
                density="compact"
              />
            </v-col>

            <v-col cols="12">
              <div>
                <span class="text-error">*</span>
                {{ locale.t("method") }}
              </div>
              <v-select
                v-model.number="state.form.method"
                :rules="state.rules.path"
                :placeholder="locale.t('method')"
                item-title="label"
                item-value="value"
                :items="props.methods"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12">
              <div>
                <span class="text-error">*</span>
                {{ locale.t("apiGroup") }}
              </div>
              <v-select
                v-model.number="state.form.apiGroup"
                :items="props.groups"
                :rules="state.rules.apiGroup"
                :placeholder="locale.t('apiGroup')"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12">
              <div>
                <span class="text-error">*</span>
                {{ locale.t("description") }}
              </div>
              <v-text-field
                v-model="state.form.description"
                :items="props.groups"
                :rules="state.rules.description"
                :placeholder="locale.t('description')"
                variant="outlined"
                density="compact"
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
