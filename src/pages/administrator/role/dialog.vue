<script setup lang="ts">
  import useVariables from "@/composables/useVariables";
  import { create, update } from "@/service/role";
  import useSnackbar from "@/composables/useSnackbar";
  import TreeSelect from "@/components/role/TreeSelect.vue";

  const props = defineProps({
    items: {
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
      parentId: null,
      authorityId: 0,
      authorityName: "",
    },
    rules: {
      authorityName: [(v: string) => !!v || locale.t("fieldIsRequired")],
      authorityId: [
        (v: string) => !!v || locale.t("fieldIsRequired"),
        (v: string) => /^\d+$/.test(v) || locale.t("mustBeANumber"),
      ],
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
        state.form.parentId = null;
      });
    } else if (key == "edit") {
      state.form.authorityId = item.authorityId;
      state.form.authorityName = item.authorityName;
      state.form.parentId = item.parentId;
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
        parentId: state.form.parentId || 0,
        authorityId: state.form.authorityId,
        authorityName: state.form.authorityName,
      };
      const response =
        state.dialog.key == "add"
          ? await create(request)
          : await update(request);
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
    <v-card flat>
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
                {{ locale.t("parent") }}
              </div>
              <!-- {{ state.form.parentId }} -->
              <TreeSelect
                v-model:model-value="state.form.parentId"
                :items="props.items"
              />
            </v-col>
            <v-col cols="12">
              <div>
                <span class="text-error">*</span>
                {{ locale.t("authorityId") }}
              </div>
              <v-text-field
                v-model.number="state.form.authorityId"
                :rules="state.rules.authorityId"
                :disabled="state.dialog.key == 'edit'"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12">
              <div>
                <span class="text-error">*</span>
                {{ locale.t("authorityName") }}
              </div>
              <v-text-field
                v-model="state.form.authorityName"
                :rules="state.rules.authorityName"
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
          @click="onSubmit"
        >
          {{ locale.t(state.dialog.confirmText) }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
