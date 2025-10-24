<script setup lang="ts">
  import { ref } from "vue";

  import { login } from "@/service/login";
  import useVariables from "@/composables/useVariables";
  import { Session } from "@/utils/storage";

  const state = reactive({
    loading: false,
    form: {
      email: "",
      username: "",
      password: "",
      remember: false,
    },
    rules: {
      email: [
        (v: string) => !!v || locale.t("emailIsRequired"),
        (v: string) =>
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
            v
          ) || "Invalid email",
      ],
      username: [(v: string) => !!v || locale.t("usernameIsRequired")],
      password: [(v: string) => !!v || locale.t("passwordIsRequired")],
    },
  });
  const { locale, store } = useVariables();
  const formRef = ref();

  const handleLogin = async () => {
    if (!(await formRef.value?.validate())) return;
    state.loading = true;
    try {
      const response = await login(state.form);
      if (response.code === 0) {
        store.user = response.data.user;
        Session.set("token", response.data.token);
        location.reload();
      }
    } catch (e) {
      console.log(e);
    } finally {
      state.loading = false;
    }
  };
</script>

<template>
  <v-container
    fluid
    class="d-flex align-center justify-center min-h-screen fill-height"
  >
    <v-card
      class="pa-6 py-8"
      elevation="10"
      max-width="550"
      min-width="400"
      rounded="xl"
    >
      <!-- App Logo -->
      <div class="text-center mb-6">
        <v-avatar
          size="64"
          class="bg-primary mb-3"
        >
          <v-icon
            icon="mdi-lock-outline"
            color="white"
            size="36"
          />
        </v-avatar>
        <h2 class="text-h5 font-weight-bold mb-1">
          {{ locale.t("wellcomeBack") }}
        </h2>
        <p class="text-body-2 text-medium-emphasis">
          {{ locale.t("signInToContinue") }}
        </p>
      </div>

      <!-- Login Form -->
      <v-form
        ref="formRef"
        @submit.prevent="handleLogin"
      >
        <v-text-field
          v-model="state.form.username"
          :label="locale.t('username')"
          variant="outlined"
          color="primary"
          prepend-inner-icon="mdi-account-outline"
          density="comfortable"
          class="mb-4"
          :rules="state.rules.username"
          required
        />

        <v-text-field
          v-model="state.form.password"
          :label="locale.t('password')"
          variant="outlined"
          color="primary"
          prepend-inner-icon="mdi-lock"
          density="comfortable"
          type="password"
          class="mb-2"
          :rules="state.rules.password"
          required
        />

        <div class="d-flex justify-space-between align-center mb-4">
          <!-- <v-switch
            v-model="state.form.remember"
            label="Remember me"
            color="primary"
            inset
            hide-details
          /> -->
          <v-btn
            variant="text"
            color="primary"
            class="text-caption"
          >
            {{ locale.t("forgotPassword") }}
          </v-btn>
        </div>

        <v-btn
          :loading="state.loading"
          block
          color="primary"
          size="large"
          rounded="lg"
          type="submit"
        >
          {{ locale.t("signIn") }}
        </v-btn>
      </v-form>

      <div class="text-center mt-6 text-body-2">
        {{ locale.t("dontHaveAnAccount") }}
        <v-btn
          variant="text"
          color="primary"
          class="text-decoration-underline"
        >
          {{ locale.t("createOne") }}
        </v-btn>
      </div>
    </v-card>
  </v-container>
</template>

<style scoped></style>
