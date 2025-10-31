<script setup lang="ts">
  import useVariables from "@/composables/useVariables";
  import { createApp, updateApp } from "@/service/analytics/app";
  import useSnackbar from "@/composables/useSnackbar";
  import { reactive } from "vue";
  import ImageUploader from "@/components/ImageUploader.vue";

  const propItems = defineProps({
    roles: {
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
      identifier: "",
      logo: "",
      name: "",
      promoteLink: "",
    },
    rules: {
      identifier: [(v: string) => !!v || locale.t("fieldIsRequired")],
      logo: [(v: string) => !!v || locale.t("fieldIsRequired")],
      promoteLink: [(v: string) => !!v || locale.t("fieldIsRequired")],
      name: [(v: string) => !!v || locale.t("fieldIsRequired")],
    },
    loading: false,
    visible: false,
  });
  const { locale, mobile } = useVariables();
  const snackbar = useSnackbar();
  const form = ref();
  const emit = defineEmits(["refresh"]);
  const closeDialog = () => {
    state.dialog.isShowDialog = false;
    state.form.logo = "";
    form.value.reset();
  };
  const onSubmit = async () => {
    const { valid } = await form.value.validate();
    if (!valid) return;
    try {
      state.loading = true;
      const response =
        state.dialog.key == "add"
          ? await createApp(state.form)
          : await updateApp(state.form);
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
  const imageUploader = ref();
  const onOpenUpload = () => {
    imageUploader.value.openDialog();
  };
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
                {{ locale.t("applicationName") }}
              </div>
              <v-text-field
                v-model="state.form.name"
                :rules="state.rules.name"
                :placeholder="locale.t('username')"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12">
              <div>
                <span class="text-error">*</span>
                {{ locale.t("applicationIdentifier") }}
              </div>
              <v-text-field
                v-model="state.form.identifier"
                :rules="state.rules.name"
                :placeholder="locale.t('applicationIdentifier')"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12">
              <div>
                <span class="text-error">*</span>
                {{ locale.t("promoteLink") }}
              </div>
              <v-text-field
                v-model.number="state.form.promoteLink"
                :rules="state.rules.promoteLink"
                :placeholder="locale.t('promoteLink')"
                variant="outlined"
                density="compact"
              />
            </v-col>

            <v-col cols="12">
              <div class="d-flex ga-4 justify-start align-center">
                <v-avatar
                  v-if="state.form.logo"
                  size="80"
                >
                  <v-img
                    :src="state.form.logo"
                    :lazy-src="state.form.logo"
                  />
                </v-avatar>
                <v-btn
                  color="secondary"
                  prepend-icon="mdi-image"
                  rounded="none"
                  :text="locale.t('uploadImage')"
                  class="text-capitalize"
                  @click="onOpenUpload"
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
    <ImageUploader
      ref="imageUploader"
      v-model:model-value="state.form.logo"
    />
  </v-dialog>
</template>
