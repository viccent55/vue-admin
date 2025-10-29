<script setup lang="ts">
  import { ref, computed, watch, type PropType } from "vue";
  import useVariables from "@/composables/useVariables";

  const { locale } = useVariables();

  const props = defineProps({
    headers: { type: Array as PropType<any[]>, required: true },
    items: { type: Array as PropType<any[]>, required: true },
    total: { type: Number, default: 0 },
    loading: { type: Boolean, default: false },
    config: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
    title: { type: String, default: "Data table" },
    showSelect: { type: Boolean, default: false },
    perPageOptions: {
      type: Array as PropType<number[]>,
      default: () => [10, 25, 50, 100],
    },
    optionAction: { type: Boolean, default: false },
  });

  const emit = defineEmits([
    "add",
    "edit",
    "delete",
    "update:options",
    "selected",
  ]);

  const searchQuery = ref(props.config.search || "");
  const selected = ref<any[]>([]);

  const options = ref({
    page: 1,
    pageSize: props.config.pageSize || 10,
    sortBy: [],
    keyword: props.config.search || "",
  });

  // 🔎 Filter client-side items
  const filteredItems = computed(() => {
    if (!searchQuery.value) return props.items;
    const q = searchQuery.value.toLowerCase();
    return props.items.filter((item: any) =>
      Object.values(item).some((v) => String(v).toLowerCase().includes(q))
    );
  });

  // ✅ Sync selected state
  watch(
    () => selected.value.length,
    () => emit("selected", selected.value)
  );

  // ✅ Sync options deeply
  watch(options, (val) => emit("update:options", val), { deep: true });

  // ✅ Pagination handler
  const onPageChange = (page: number) => {
    options.value.page = page;
  };

  const dialogDelete = ref();

  const onOpenConfirm = (item: Record<string, any>) => {
    dialogDelete.value?.open("areYouSure", item);
  };

  const onDelete = (item: Record<string, any>) => emit("delete", item);
  const onCancel = () => {};
</script>

<template>
  <v-card>
    <v-toolbar
      flat
      color="transparent"
    >
      <v-toolbar-title class="text-h6 font-weight-medium">
        {{ title }}
      </v-toolbar-title>

      <v-spacer />

      <!-- Search -->
      <v-text-field
        v-model="searchQuery"
        density="compact"
        variant="outlined"
        rounded="xl"
        prepend-inner-icon="mdi-magnify"
        hide-details
        :placeholder="locale.t('search')"
        class="mr-3"
        style="max-width: 250px"
      />

      <!-- Add Button -->
      <v-btn
        variant="flat"
        color="success"
        prepend-icon="mdi-plus"
        @click="emit('add')"
      >
        Add
      </v-btn>
    </v-toolbar>

    <!-- Data Table -->
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="filteredItems"
      :items-per-page="options.pageSize"
      :loading="loading"
      :show-select="showSelect"
      class="elevation-0"
      style="min-height: 70vh"
    >
      <!-- Select all checkbox -->
      <template
        #header.data-table-select="{ allSelected, someSelected, selectAll }"
      >
        <v-checkbox-btn
          :indeterminate="someSelected && !allSelected"
          :model-value="allSelected"
          color="primary"
          @update:model-value="selectAll(!allSelected)"
        />
      </template>

      <!-- Row checkbox -->
      <template
        #item.data-table-select="{ internalItem, isSelected, toggleSelect }"
      >
        <v-checkbox-btn
          :model-value="isSelected(internalItem)"
          color="primary"
          @update:model-value="toggleSelect(internalItem)"
        />
      </template>
      <template #item.image="{ item }">
        <v-avatar size="60px">
          <v-img :src="item.headerImg" />
        </v-avatar>
      </template>
      <template #item.enable="{ item }">
        <v-chip
          rounded
          flat
          :color="item.enable ? 'success' : 'error'"
          append-icon="mdi-check-circle"
        >
          {{ item.enable ? locale.t("enable") : locale.t("disable") }}
        </v-chip>
      </template>
      <template #item.select="{ item }">
        <v-group-chip
          style="width: 250px"
          class="d-flex ga-2 my-2 flex-wrap"
        >
          <v-chip
            v-for="(value, index) in item.authorities"
            :key="index"
            size="small"
            density="comfortable"
            rounded="lg"
          >
            {{ value.authorityName }}
          </v-chip>
        </v-group-chip>
      </template>
      <!-- Actions -->
      <template #item.actions="{ item }">
        <v-btn
          icon="mdi-pencil"
          size="small"
          color="warning"
          variant="text"
          @click="emit('edit', item)"
        />
        <v-btn
          icon="mdi-delete"
          size="small"
          color="error"
          variant="text"
          @click="onOpenConfirm(item)"
        />
      </template>

      <!-- Pagination footer -->
      <template #bottom>
        <div class="d-flex justify-end align-center ga-3 px-5 pt-2">
          <div>{{ locale.t("itemsPerPage") }}</div>
          <v-select
            v-model="options.pageSize"
            :items="perPageOptions"
            hide-details
            density="compact"
            class="page-size-select"
            @update:model-value="options.page = 1"
          />

          <v-pagination
            v-model="options.page"
            active-color="primary"
            color="primary"
            :length="Math.ceil(total / options.pageSize)"
            :total-visible="7"
            prev-icon="mdi-chevron-left"
            next-icon="mdi-chevron-right"
            density="compact"
            @update:model-value="onPageChange"
          />
        </div>
        <div class="text-body-2 text-end pr-5 pb-2">
          {{ locale.t("page") }} {{ options.page }} of
          {{ Math.ceil(total / options.pageSize) }} — {{ locale.t("showing") }}
          {{ filteredItems.length }} / {{ total }} {{ locale.t("items") }}
        </div>
      </template>
    </v-data-table>

    <DialogConfirm
      ref="dialogDelete"
      @cancel="onCancel"
      @confirm="onDelete"
    />
  </v-card>
</template>
<style scoped lang="scss">
  .page-size-select {
    max-width: 90px;
  }
</style>
