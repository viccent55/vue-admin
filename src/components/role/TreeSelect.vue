<script setup lang="ts">
  import useVariables from "@/composables/useVariables";
  import { ref, watch, computed, type PropType } from "vue";

  const props = defineProps({
    items: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    // Prop to support v-model for selected values (array of IDs)
    modelValue: {
      type: [String, Number, null] as PropType<string | number | null>,
      default: null,
    },
  });

  const { locale } = useVariables();
  const emit = defineEmits(["update:modelValue"]);

  // 1. Local state for single selection: will hold a single ID or null
  const selectedId = ref<string | number | null>(props.modelValue);
  const menu = ref(false);

  // 2. Helper function to find title for a single selected ID
  const findTitle = (
    nodes: any[],
    id: string | number | null
  ): string | null => {
    if (id === null) return null;
    let title: string | null = null;
    const traverse = (currentNodes: any[]) => {
      for (const node of currentNodes) {
        // Use authorityId for comparison
        if (node.authorityId === id) {
          title = node.authorityName;
          return; // Found, stop traversing
        }
        if (node.children && title === null) {
          traverse(node.children);
        }
      }
    };
    traverse(nodes);
    return title;
  };

  // 3. Computed property for display text in the v-text-field
  const selectedTitle = computed(() => {
    const title = findTitle(treeItems.value, selectedId.value);
    return title ?? locale.t("rootRole");
  });

  // 4. Watch local selection changes to emit to parent
  watch(selectedId, (newSelected) => {
    emit("update:modelValue", newSelected);
  });

  // 5. Watch external v-model changes to update local state
  watch(
    () => props.modelValue,
    (newVal) => {
      if (newVal !== selectedId.value) {
        selectedId.value = newVal;
      }
    }
  );

  // 6. Handle clear button on v-text-field
  const handleClear = () => {
    selectedId.value = null;
  };

  // Handle selection change from the v-radio group
  const handleRadioChange = (newVal: number | string | null) => {
    selectedId.value = newVal;
    menu.value = false; // Close menu after selection
  };
  const treeItems = computed(() => [
    {
      authorityId: 0,
      authorityName: locale.t("rootRole"),
      children: [],
    },
    ...props.items,
  ]);
</script>

<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    min-width="300"
    max-height="400"
    offset-y
  >
    <template #activator="{ props: menuProps }">
      <v-text-field
        v-bind="menuProps"
        :model-value="selectedTitle"
        variant="outlined"
        density="compact"
        :placeholder="locale.t('rootRole')"
        readonly
        append-inner-icon="mdi-menu-down"
        clearable
        @click:clear="handleClear"
      />
    </template>

    <v-card>
      <v-card-text class="pa-0">
        <v-radio-group
          :model-value="selectedId"
          color="primary"
          @update:model-value="(v) => handleRadioChange(v)"
        >
          <v-treeview
            :items="treeItems"
            open-on-click
            :activated="selectedId ? [selectedId] : []"
            item-title="authorityName"
            item-value="authorityId"
            select-strategy="single-leaf"
          >
            <template #prepend="{ item }">
              <v-radio :value="item.authorityId" />
            </template>
          </v-treeview>
        </v-radio-group>
      </v-card-text>
    </v-card>
  </v-menu>
</template>
