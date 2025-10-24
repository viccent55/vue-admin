<script setup lang="ts">
  import { THEME_KEY } from "vue-echarts";
  import useVariables from "./composables/useVariables";
  const theme = useTheme();

  provide(
    THEME_KEY,
    computed(() => (theme.current.value.dark ? "dark" : undefined))
  );

  const { locale, store } = useVariables();
  const changeLocale = (en: string) => {
    locale.select(en);
  };
  onMounted(() => {
    changeLocale(store.lang);
  });
</script>

<template>
  <v-app>
    <show-snackbar />
    <router-view />
  </v-app>
</template>
