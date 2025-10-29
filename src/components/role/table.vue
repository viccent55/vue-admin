<script setup lang="ts">
  import { watch, type PropType } from "vue";
  import useVariables from "@/composables/useVariables";

  const { locale, debounce } = useVariables();
  const emit = defineEmits([
    "add",
    "edit",
    "delete",
    "update:options",
    "permission",
  ]);

  interface Authority {
    authorityId: number;
    authorityName: string;
    parentId: number;
    children?: Authority[];
    defaultRouter?: string;
  }

  // -------- Props --------
  const props = defineProps({
    headers: {
      type: Array as PropType<any[]>,
      required: true,
    },
    items: {
      type: Array as PropType<Authority[]>,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    totalItems: {
      type: Number,
      default: 0,
    },
    itemsPerPage: {
      type: Number,
      default: 10,
    },
    search: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "Data table",
    },
    level: {
      type: Number,
      default: 0, // used for indentation
    },
  });

  // -------- Internal State --------
  const searchQuery = ref("");
  const expanded = ref<any[]>([]); // v-data-table needs an array, not a Set
  const options = ref({
    page: 1,
    itemsPerPage: props.itemsPerPage,
    keyword: "",
  });

  watch(options, (val) => {
    emit("update:options", val);
  });

  // -------- Filtering --------

  // -------- Expand Handlers --------
  const toggleExpand = (item: Authority) => {
    const index = expanded.value.findIndex((a) => a === item.authorityId);
    if (index > -1) expanded.value.splice(index, 1);
    else expanded.value.push(item.authorityId);
  };

  const isExpanded = (item: Authority) =>
    expanded.value.includes(item.authorityId);

  // -------- Emitters --------
  const onCancel = () => {
    console.log("cancel");
  };

  const onDelete = (item: EmptyObjectType) => {
    emit("delete", item);
  };
  const dialogDelete = ref();
  const onOpenConfirm = (item: EmptyObjectType) => {
    dialogDelete?.value.open("areYouSure", item);
  };

  // Debounce the search emit
  const debouncedSearch = debounce((value: string) => {
    options.value.keyword = value;
    emit("update:options", options.value);
  }, 300);
  watch(searchQuery, debouncedSearch);
</script>

<template>
  <v-card
    elevation="0"
    :class="{ 'mt-2': level > 0 }"
  >
    <!-- Top Toolbar (only top level) -->
    <v-toolbar
      v-if="level === 0"
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
        clearable
        style="max-width: 250px"
      />

      <!-- Add -->
      <v-btn
        variant="flat"
        color="success"
        prepend-icon="mdi-plus"
        @click="emit('add')"
      >
        {{ locale.t("add") }}
      </v-btn>
    </v-toolbar>

    <!-- Main Table -->
    <v-data-table
      v-model:page="options.page"
      v-model:expanded="expanded"
      :show-expand="true"
      fixed-header
      :headers="headers"
      :items="items"
      :loading="loading"
      density="comfortable"
      item-value="authorityId"
      :height="`calc(100vh - 260px)`"
    >
      <!-- Expand button slot (indent + arrow) -->
      <template #item.data-table-expand="{ item }">
        <div :style="{ paddingLeft: `${level * 20}px` }">
          <v-btn
            v-if="item.children && item.children.length"
            icon
            size="x-small"
            variant="text"
            color="primary"
            @click.stop="toggleExpand(item)"
          >
            <v-icon v-if="isExpanded(item)">mdi-chevron-down</v-icon>
            <v-icon v-else>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </template>

      <!-- Action Buttons -->
      <template #item.actions="{ item }">
        <v-btn
          icon="mdi-cog"
          size="small"
          color="secondary"
          variant="text"
          @click="emit('permission', item)"
        />
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
          color="primary"
          variant="text"
          @click="onOpenConfirm(item as EmptyObjectType)"
        />
      </template>

      <!-- Expanded Child Rows -->
      <template #expanded-row="{ item }">
        <tr>
          <td
            :colspan="headers.length"
            class="pa-0"
          >
            <TreeTableRows
              v-if="item.children && item.children.length"
              :headers="headers"
              :items="item.children"
              :level="level + 1"
              @add="(v) => emit('add', v)"
              @edit="(v) => emit('edit', v)"
              @delete="(v) => onOpenConfirm(v)"
              @permission="(v) => emit('permission', v)"
            />
          </td>
        </tr>
      </template>
    </v-data-table>
    <DialogConfirm
      ref="dialogDelete"
      @cancel="onCancel"
      @confirm="onDelete"
    />
  </v-card>
</template>

<style scoped>
  .v-data-table :deep(tbody tr:hover) {
    background-color: rgba(0, 0, 0, 0.04);
  }

  /* Visually separate nested levels */
  .v-card.mt-2 {
    border-left: 2px solid var(--v-theme-primary);
  }
</style>
