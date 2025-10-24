<script setup lang="ts">
  import { THEME_KEY } from "vue-echarts";
  import useVariables from "./composables/useVariables";
  import type { VSnackbar } from "vuetify/components/VSnackbar";
  import { provide } from "vue";
  const theme = useTheme();

  provide(
    THEME_KEY,
    computed(() => (theme.current.value.dark ? "dark" : undefined))
  );

  const { locale, store } = useVariables();
  const changeLocale = (en: string) => {
    locale.select(en);
  };

  type SnackbarLocation = VSnackbar["$props"]["location"];

  const state = reactive({
    message: "",
    color: "primary",
    timeout: 3000,
    show: false,
    location: "bottom center" as SnackbarLocation,
  });
  const triggerSnackbar = (
    msg: string,
    color: string = "success",
    location: SnackbarLocation = "bottom center",
    time: number = 3000
  ) => {
    state.message = msg;
    state.color = color;
    state.timeout = time;
    state.show = true;
    state.location = location;
  };
  provide("showSnackbar", triggerSnackbar);
  onMounted(() => {
    changeLocale(store.lang);
  });
</script>

<template>
  <v-snackbar
    v-model="state.show"
    :color="state.color"
    :timeout="state.timeout"
    :location="state.location"
  >
    {{ state.message }}
    <template #actions>
      <v-btn
        color="white"
        density="compact"
        variant="elevated"
        elevation="0"
        @click="state.show = false"
      >
        关闭
      </v-btn>
    </template>
  </v-snackbar>
  <v-app>
    <router-view />
  </v-app>
</template>
