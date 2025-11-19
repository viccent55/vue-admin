<script setup lang="ts">
  import useVariables from "@/composables/useVariables";
  import { createProduct, updateProduct } from "@/service/application/product";
  import useSnackbar from "@/composables/useSnackbar";
  import { reactive } from "vue";
  import ImageUploader from "@/components/ImageUploader.vue";

  const Editor = defineAsyncComponent(
    () => import("@/components/editor/index.vue")
  );

  const props = defineProps({
    status: {
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
      ID: null as null | number,
      commissionRate: null as null | number,
      description: "",
      linkType: "",
      price: null as null | number,
      productCategory: "",
      productCode: "",
      productImage: "",
      productName: "",
      productUrl: "",
      status: "",
    },
    rules: {
      productCode: [(v: string) => !!v || locale.t("fieldIsRequired")],
      productName: [(v: string) => !!v || locale.t("fieldIsRequired")],
      price: [
        (v: number | string) =>
          (v !== null && v !== undefined && v !== "") ||
          locale.t("fieldIsRequired"),
      ],
      commissionRate: [
        (v: number | string) =>
          (v !== null && v !== undefined && v !== "") ||
          locale.t("fieldIsRequired"),
      ],
      status: [(v: string) => !!v || locale.t("fieldIsRequired")],
      statcomissionRateus: [(v: string) => !!v || locale.t("fieldIsRequired")],
    },
    loading: false,
    visible: false,
    linkTypes: [
      {
        label: computed(() => locale.t("pathParameter")),
        value: "path",
      },
      {
        label: computed(() => locale.t("queryParameter")),
        value: "query",
      },
      {
        label: computed(() => locale.t("affiliateLink")),
        value: "aff",
      },
    ],
  });
  const { locale, mobile } = useVariables();
  const snackbar = useSnackbar();
  const form = ref();
  const emit = defineEmits(["refresh"]);
  const closeDialog = () => {
    state.dialog.isShowDialog = false;
    state.form.productImage = "";
    form.value.reset();
  };
  const onSubmit = async () => {
    const { valid } = await form.value.validate();
    if (!valid) return;
    try {
      state.loading = true;
      const response =
        state.dialog.key == "add"
          ? await createProduct(state.form)
          : await updateProduct(state.form);
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
                {{ locale.t("productCode") }}
              </div>
              <v-text-field
                v-model="state.form.productCode"
                :rules="state.rules.productCode"
                :placeholder="locale.t('productCode')"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12">
              <div>
                <span class="text-error">*</span>
                {{ locale.t("productName") }}
              </div>
              <v-text-field
                v-model="state.form.productName"
                :rules="state.rules.productName"
                :placeholder="locale.t('productName')"
                variant="outlined"
                density="compact"
              />
            </v-col>

            <v-col cols="12">
              <div>
                <span class="text-error">*</span>
                {{ locale.t("productPrice") }}
              </div>
              <v-number-input
                v-model="state.form.price"
                :rules="state.rules.price"
                :inset="false"
                density="compact"
              ></v-number-input>
            </v-col>
            <v-col cols="12">
              <div>
                <span class="text-error">*</span>
                {{ locale.t("commissionRate") }}
              </div>
              <v-number-input
                v-model="state.form.commissionRate"
                :rules="state.rules.commissionRate"
                :inset="false"
                density="compact"
              ></v-number-input>
            </v-col>
            <v-col cols="12">
              <div>
                <span class="text-error">*</span>
                {{ locale.t("productLink") }}
              </div>
              <v-text-field
                v-model.number="state.form.productUrl"
                :placeholder="locale.t('productLink')"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12">
              <div>
                <span class="text-error">*</span>
                {{ locale.t("linkType") }}
              </div>
              <v-select
                v-model="state.form.linkType"
                :items="state.linkTypes"
                item-title="label"
                item-value="value"
                :placeholder="locale.t('linkType')"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12">
              <div class="d-flex ga-4 justify-start align-center">
                <v-avatar
                  v-if="state.form.productImage"
                  size="80"
                >
                  <v-img
                    :src="state.form.productImage"
                    :lazy-src="state.form.productImage"
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
            <v-col cols="12">
              <div>
                <span class="text-error">*</span>
                {{ locale.t("productStatus") }}
              </div>

              <v-select
                v-model="state.form.status"
                :items="props.status"
                item-title="label"
                item-value="value"
                :placeholder="locale.t('productStatus')"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12">
              <div>
                {{ locale.t("productDescription") }}
              </div>
              <Editor
                v-model:get-html="state.form.description"
                :height="'300px'"
                :placeholder="locale.t('productDescription')"
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
    <ImageUploader
      ref="imageUploader"
      v-model:model-value="state.form.productImage"
    />
  </v-dialog>
</template>
