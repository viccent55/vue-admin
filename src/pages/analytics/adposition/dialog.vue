<script setup lang="ts">
  import useVariables from "@/composables/useVariables";
  import {
    createAdPosition,
    updateAdPositionList,
  } from "@/service/analytics/adposition";
  import useSnackbar from "@/composables/useSnackbar";
  import { reactive } from "vue";

  const propItems = defineProps({});

  const state = reactive({
    dialog: {
      isShowDialog: false,
      key: "",
      title: "",
      cancelText: "cancel",
      confirmText: "submit",
    },
    form: {
      positionName: "",
      positionKey: "",
      ID: 0,
    },
    rules: {
      positionName: [(v: string) => !!v || locale.t("fieldIsRequired")],
      positionKey: [(v: string) => !!v || locale.t("fieldIsRequired")],
    },
    loading: false,
  });
  const { locale, mobile } = useVariables();
  const snackbar = useSnackbar();
  const form = ref();
  const emit = defineEmits(["refresh"]);
  const closeDialog = () => {
    state.dialog.isShowDialog = false;
    state.form.ID = 0;
    form.value.reset();
  };
  const onSubmit = async () => {
    const { valid } = await form.value.validate();
    if (!valid) return;
    try {
      state.loading = true;
      const response =
        state.dialog.key == "add"
          ? await createAdPosition(state.form)
          : await updateAdPositionList(state.form);
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
                {{ locale.t("positionName") }}
              </div>
              <v-text-field
                v-model="state.form.positionName"
                :rules="state.rules.positionName"
                :placeholder="locale.t('positionName')"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12">
              <div>
                <span class="text-error">*</span>
                {{ locale.t("positionKey") }}
              </div>
              <v-text-field
                v-model="state.form.positionKey"
                :rules="state.rules.positionKey"
                :placeholder="locale.t('positionKey')"
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
