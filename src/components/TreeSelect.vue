<script setup lang="ts">
  import { ref, computed, watch } from "vue";

  const props = defineProps({
    items: {
      type: Array,
      default: () => [],
    },
    modelValue: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: "title",
    },
    id: {
      type: String,
      default: "id",
    },
    type: {
      type: String,
      default: "menu",
    },
    openAll: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(["update:modelValue"]);

  const search = ref("");
  const selected = ref<any[]>([]);
  const open = ref<any[]>([]);

  const allParentIds = computed(() => {
    function getAllIds(items: any[], idKey: any) {
      let ids: any[] = []; // changed from: let ids = <any>[];
      for (const item of items) {
        if (item.children && item.children.length > 0) {
          ids.push(item[idKey]);
          ids = ids.concat(getAllIds(item.children, idKey));
        }
      }
      return ids;
    }
    return getAllIds(props.items, props.id);
  });

  watch(
    () => props.openAll,
    (shouldOpenAll) => {
      if (shouldOpenAll) {
        open.value = allParentIds.value;
      }
    },
    { immediate: true }
  );

  watch(allParentIds, (newIds) => {
    if (props.openAll) {
      open.value = newIds;
    }
  });

  watch(selected, (newValue) => {
    emit("update:modelValue", newValue);
  });

  // Recursively filter tree by search
  const filteredItems = computed(() => {
    const filterTree = (nodes: any[]) =>
      nodes
        .map((node) => {
          const match = node[props.title]
            ?.toLowerCase()
            .includes(search.value.toLowerCase());
          if (node.children?.length) {
            const filteredChildren: any = filterTree(node.children);
            if (filteredChildren.length || match) {
              return { ...node, children: filteredChildren };
            }
          }
          return match ? node : null;
        })
        .filter(Boolean);

    return search.value ? filterTree(props.items) : props.items;
  });
  const getCompleteSelection = (
    items: any,
    selectedIds: number[],
    idKey: string
  ) => {
    const selectedSet = new Set(selectedIds);
    const traverse = (nodes: any) => {
      for (const node of nodes) {
        if (node.children && node.children.length > 0) {
          traverse(node.children); // Recurse down first
          const allChildrenSelected = node.children.every((child: any) =>
            selectedSet.has(child[idKey])
          );
          if (allChildrenSelected) {
            selectedSet.add(node[idKey]);
          }
        }
      }
    };
    traverse(items);
    return Array.from(selectedSet);
  };

  watch(
    () => props.modelValue,
    (newModelValue: any) => {
      if (props.items.length > 0 && newModelValue) {
        const completeSelection = getCompleteSelection(
          props.items,
          newModelValue,
          props.id
        );
        // Only update if different to prevent infinite loops
        if (
          JSON.stringify(completeSelection.sort()) !==
          JSON.stringify(selected.value.sort())
        ) {
          selected.value = completeSelection;
        }
      } else if (newModelValue) {
        selected.value = newModelValue;
      }
    },
    { immediate: true, deep: true }
  );
</script>

<template>
  <div>
    <v-text-field
      v-model="search"
      placeholder="Filter..."
      prepend-inner-icon="mdi-magnify"
      density="compact"
      hide-details
      class="mt-4"
    />

    <v-treeview
      v-model:selected="selected"
      v-model:opened="open"
      :items="filteredItems"
      color="primary"
      selectable
      select-strategy="classic"
      item-props
      :item-title="title"
      :item-value="id"
      item-disabled="disabled"
      open-on-click
      density="compact"
    >
      <template #append="{ item }">
        <div
          v-if="type === 'menu'"
          class="text-green text-caption ml-2"
        >
          {{ item.children?.length ? "设为首页" : "" }}
        </div>
        <div
          v-if="type === 'api'"
          class="text-body-2"
        >
          {{ item?.path }}
        </div>
      </template>
    </v-treeview>
  </div>
</template>

<style scoped>
  .v-treeview-node__root {
    padding-top: 2px;
    padding-bottom: 2px;
  }
  .v-treeview-node__label {
    font-size: 14px;
  }
</style>
