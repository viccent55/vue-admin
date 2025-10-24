<script setup lang="ts">
  import type { RouteRecordRaw } from "vue-router";
  import { useLocale } from "@vuetify/v0";

  const { level = 0, item } = defineProps<{
    level?: number;
    item: RouteRecordRaw;
  }>();

  const visibleChildren = computed(() =>
    item.children?.filter((child) => !child.meta?.isHide)
  );

  const hasVisibleChildren = computed(
    () => visibleChildren.value?.length || 0 > 0
  );

  const isGroup = computed(() => hasVisibleChildren.value);

  const title = toRef(() => item.meta?.title as string);
  const icon = toRef(() => item.meta?.icon as string);

  const to = computed(() => {
    // If it's a group and has a redirect, use it. Otherwise, use its own path.
    if (isGroup.value) {
      return { path: (item.redirect as string) || item.path };
    }
    // If it's a single item, use its path.
    return { path: item.path };
  });
  const locale = useLocale();
</script>

<template>
  <v-list-group
    v-if="isGroup"
    :value="item.name"
  >
    <template #activator="{ props }">
      <v-list-item
        color="primary"
        v-bind="props"
        :prepend-icon="icon"
        :title="locale.t(title)"
      />
    </template>
    <AppDrawerItem
      v-for="child in visibleChildren"
      :key="child.name"
      :item="child"
      :level="level + 1"
    />
  </v-list-group>
  <v-list-item
    v-else
    color="primary"
    rounded="xl"
    :prepend-icon="icon"
    :title="locale.t(title)"
    :to="to"
    link
  />
</template>
