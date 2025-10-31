<template>
  <v-overlay
    :model-value="loading"
    location-strategy="static"
    scroll-strategy="block"
    persistent
    :contained="contained"
  >
    <v-progress-circular
      :size="50"
      indeterminate
      class="m-auto"
      color="primary"
    ></v-progress-circular>
  </v-overlay>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      loading?: boolean;
      contained?: boolean;
    }>(),
    {
      loading: false,
      contained: false,
    }
  );
</script>

<style lang="css" scoped>
  :deep(.v-overlay__content) {
    top: 50%;
    left: 50%;
  }
</style>
