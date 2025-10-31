<script setup lang="ts">
  import useVariables from "@/composables/useVariables";
  import { createUser, updateUser } from "@/service/admin/user";
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
      authorityId: "",
      authorityIds: [] as EmptyArrayType,
      email: "",
      enable: 1,
      headerImg: "",
      nickName: "",
      password: "",
      phone: "",
      userName: "",
    },
    rules: {
      userName: [(v: string) => !!v || locale.t("fieldIsRequired")],
      password: [(v: string) => !!v || locale.t("fieldIsRequired")],
      phone: [(v: string) => !!v || locale.t("fieldIsRequired")],
      email: [
        (v: string) => !!v || locale.t("fieldIsRequired"),
        (value: string) => {
          if (/^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) return true;
          return locale.t("itMustBeAValidEmailAdress");
        },
      ],
      authorityIds: [(v: any[]) => v.length > 0 || locale.t("fieldIsRequired")],
      nickname: [(v: string) => !!v || locale.t("fieldIsRequired")],
    },
    loading: false,
    parentItem: {
      authorityId: 0,
      authorityName: "",
    },
    menu: false,
    selected: [],
    visible: false,
  });
  const { locale, mobile } = useVariables();
  const snackbar = useSnackbar();
  const form = ref();
  const emit = defineEmits(["refresh"]);

  const flattenRoles = (roles: any[]): any[] => {
    return roles.flatMap((role) => [
      role,
      ...(role.children ? flattenRoles(role.children) : []),
    ]);
  };

  const flatRoles = computed(() => flattenRoles(propItems.roles));

  const open = (key: string, item: EmptyObjectType) => {
    state.dialog.isShowDialog = true;
    state.dialog.key = key;

    if (key == "add") {
      state.form.enable = 1;
    } else if (key == "edit") {
      Object.assign(state.form, item);
      state.form.authorityIds = item.authorities.map(
        (item: any) => item.authorityId
      );
    }
  };

  const closeDialog = () => {
    state.dialog.isShowDialog = false;
    form.value.reset();
    state.form.headerImg = "";
  };
  const onSubmit = async () => {
    const { valid } = await form.value.validate();
    if (!valid) return;
    if (!state.form.headerImg) {
      return snackbar.showSnackbar(
        locale.t("pleaseUploadImage"),
        "error",
        "top"
      );
    }
    try {
      state.loading = true;
      const request = {
        ...state.form,
        authorityId: state.form.authorityId || state.form.authorityIds[0],
        authorityIds: state.form.authorityIds,
      };
      const response =
        state.dialog.key == "add"
          ? await createUser(request)
          : await updateUser(request);
      if (response.code == 0) {
        snackbar.showSnackbar(
          locale.t("createSuccess", "success", "top center")
        );
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
    open,
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
                {{ locale.t("username") }}
              </div>
              <v-text-field
                v-model="state.form.userName"
                :rules="state.rules.userName"
                :placeholder="locale.t('username')"
                variant="outlined"
                density="compact"
              />
            </v-col>

            <v-col
              v-if="state.dialog.key == 'add'"
              cols="12"
            >
              <div>
                <span class="text-error">*</span>
                {{ locale.t("password") }}
              </div>
              <v-text-field
                v-model="state.form.password"
                :rules="state.rules.password"
                :placeholder="locale.t('password')"
                variant="outlined"
                density="compact"
                :type="state.visible ? 'text' : 'password'"
                :append-inner-icon="state.visible ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="state.visible = !state.visible"
              />
            </v-col>
            <v-col cols="12">
              <div>
                <span class="text-error">*</span>
                {{ locale.t("nickname") }}
              </div>
              <v-text-field
                v-model="state.form.nickName"
                :rules="state.rules.nickname"
                :placeholder="locale.t('nickname')"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12">
              <div>
                <span class="text-error">*</span>
                {{ locale.t("email") }}
              </div>
              <v-text-field
                v-model.number="state.form.email"
                :rules="state.rules.email"
                :placeholder="locale.t('email')"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12">
              <div>
                <span class="text-error">*</span>
                {{ locale.t("userRole") }}
              </div>
              <!-- {{ props.roles }} -->
              <v-menu
                v-model="state.menu"
                :close-on-content-click="false"
                max-width="400"
              >
                <template #activator="{ props }">
                  <v-select
                    v-bind="props"
                    v-model="state.form.authorityIds"
                    :items="flatRoles"
                    :rules="state.rules.authorityIds"
                    item-title="authorityName"
                    item-value="authorityId"
                    multiple
                    :placeholder="locale.t('userRole')"
                    variant="outlined"
                    readonly
                    density="compact"
                    @click="state.menu = true"
                  />
                </template>

                <v-card>
                  <v-treeview
                    v-model:selected="state.form.authorityIds"
                    :rules="state.rules.authorityIds"
                    :items="propItems.roles"
                    selectable
                    select-strategy="independent"
                    item-title="authorityName"
                    item-value="authorityId"
                    open-on-click
                    density="compact"
                  />
                </v-card>
              </v-menu>
            </v-col>
            <v-col
              cols="6"
              class="d-flex"
            >
              <div class="d-flex ga-4 justify-start align-center">
                <v-avatar
                  v-if="state.form.headerImg"
                  size="80"
                >
                  <v-img
                    :src="state.form.headerImg"
                    :lazy-src="state.form.headerImg"
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
            <v-col cols="6">
              <div>
                {{ locale.t("enable") }}
              </div>
              <v-switch
                v-model="state.form.enable"
                hide-details
                :true-value="1"
                :false-value="2"
                inset
                class="switch-toggle"
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
    <ImageUploader
      ref="imageUploader"
      v-model:model-value="state.form.headerImg"
    />
  </v-dialog>
</template>

<style scoped lang="scss">
  :deep(.switch-toggle .v-input__control .v-selection-control) {
    min-height: 40px;
  }
</style>
