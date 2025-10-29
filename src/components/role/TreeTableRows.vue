<script setup lang="ts">
  import { ref, computed, watch, type PropType } from "vue";
  import useVariables from "@/composables/useVariables";

  const { locale } = useVariables();
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
  const searchQuery = ref(props.search);
  const expanded = ref<any[]>([]); // v-data-table needs an array, not a Set
  const options = ref({
    page: 1,
    itemsPerPage: props.itemsPerPage,
    sortBy: [],
    sortDesc: [],
  });

  watch(options, (val) => {
    emit("update:options", val);
  });

  // -------- Filtering --------
  const filteredItems = computed(() => {
    if (!searchQuery.value) return props.items;
    const query = searchQuery.value.toLowerCase();
    return props.items.filter((item: any) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(query)
      )
    );
  });

  // -------- Expand Handlers --------
  const toggleExpand = (item: Authority) => {
    const index = expanded.value.findIndex((a) => a === item.authorityId);
    if (index > -1) expanded.value.splice(index, 1);
    else expanded.value.push(item.authorityId);
  };

  const isExpanded = (item: Authority) =>
    expanded.value.includes(item.authorityId);

  // -------- Emitters --------
  const setPermission = (item: Authority) => emit("permission", item);
  const onEdit = (item: Authority) => emit("edit", item);
  const onDelete = (item: Authority) => emit("delete", item);
</script>

<template>
  <v-card
    elevation="0"
    class="ma-5 border mt-2"
  >
    <!-- Main Table -->
    <v-data-table
      v-model:expanded="expanded"
      :show-expand="true"
      :headers="headers"
      :items="filteredItems"
      :loading="loading"
      density="comfortable"
      item-value="authorityId"
      hide-default-footer
      class="elevation-0"
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
          @click="setPermission(item)"
        />
        <v-btn
          icon="mdi-pencil"
          size="small"
          color="grey"
          variant="text"
          @click="onEdit(item)"
        />
        <v-btn
          icon="mdi-delete"
          color="primary"
          size="small"
          variant="text"
          @click="onDelete(item)"
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
            />
          </td>
        </tr>
      </template>

      <!-- No data -->
      <template #no-data>
        <v-alert
          type="info"
          border="start"
          variant="text"
        >
          {{ locale.t("noRecordFound") }}
        </v-alert>
      </template>
    </v-data-table>
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
