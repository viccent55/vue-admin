<script setup lang="ts">
  import { useToggle, useDark } from "@vueuse/core";
  import useVariables from "@/composables/useVariables";
  import { Session } from "@/utils/storage";

  const theme = useTheme();
  const { drawer } = storeToRefs(useAppStore());
  const { locale, route, store } = useVariables();

  const breadcrumbs = computed(() => {
    return route!.matched
      .filter((item) => item.meta && item.meta.title)
      .map((r) => ({
        title: r.meta.title!,
        disabled: r.path === route.path || false,
        to: r.path,
      }))
      .map((item) => ({
        ...item,
        title: locale.t(String(item.title)),
      }));
  });
  const isDark = useDark({
    onChanged(dark: boolean) {
      theme.change(dark ? "light" : "dark");
    },
  });
  const toggleDark = useToggle<true, false | null>(isDark);
  const changeLocale = (en: string) => {
    locale.select(en);
    store.lang = en;
  };
  const onLogout = () => {
    Session.clear();
    location.reload();
  };
</script>

<template>
  <v-app-bar flat>
    <v-app-bar-nav-icon @click="drawer = !drawer" />
    <v-breadcrumbs :items="breadcrumbs" />
    <v-spacer />
    <div id="app-bar" />
    <div class="d-flex ga-2 align-center px-2">
      <v-menu offset="10">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            rounded
            color="primary"
          >
            <div class="d-flex align-center ga-2">
              <v-icon
                icon="mdi-translate"
                size="20"
              />
              <span class="text-body-1">
                {{ store.lang === "cn" ? "中文" : "English" }}
              </span>
            </div>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="changeLocale('cn')">中文</v-list-item>
          <v-list-item @click="changeLocale('en')">English</v-list-item>
        </v-list>
      </v-menu>
      <v-switch
        :model-value="isDark"
        color=""
        hide-details
        density="compact"
        inset
        false-icon="mdi-white-balance-sunny"
        true-icon="mdi-weather-night"
        style="opacity: 0.8"
        @update:model-value="toggleDark"
      />
      <v-btn
        color="primary"
        variant="elevated"
        append-icon="mdi-logout"
        size="small"
        height="32px"
        @click="onLogout()"
      >
        <span class="text-body-2">{{ locale.t("logout") }}</span>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<style scoped>
  :deep(.v-breadcrumbs-divider) {
    opacity: 0.5;
  }

  :deep(.v-switch__thumb .v-icon) {
    --v-icon-size-multiplier: 1.2 !important;
  }
</style>
