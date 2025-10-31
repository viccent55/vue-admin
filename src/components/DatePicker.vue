<template>
  <v-menu
    v-model="state.menu"
    :close-on-content-click="false"
    :nudge-right="40"
    offset-y
  >
    <template #activator="{ props: prop }">
      <v-text-field
        v-model="state.formattedDate"
        v-maska="'##/##/####'"
        variant="outlined"
        density="compact"
        :placeholder="placeholder"
        prepend-inner-icon="mdi-calendar"
        :rules="displayRules"
        hide-details="auto"
        v-bind="prop"
        clearable
        clear-icon="mdi-close-circle-outline"
        @click:clear="clearDate"
      ></v-text-field>
    </template>

    <v-date-picker
      v-model="state.datePicker"
      color="secondary"
      :max="maxDate"
      :min="minDate"
      @update:model-value="onDateSelected"
    ></v-date-picker>
  </v-menu>
</template>

<script setup lang="ts">
  import moment from "moment";
  import useSnackbar from "@/composables/useSnackbar";
  import { vMaska } from "maska/vue";

  const { showSnackbar } = useSnackbar();

  interface Props {
    date?: string | null;
    placeholder?: string;
    rules?: ((v: any) => boolean | string)[];
    minDate?: string | null;
    maxDate?: string | null;
  }

  const props = withDefaults(defineProps<Props>(), {
    date: null,
    placeholder: "DD/MM/YYYY",
    rules: () => [],
    minDate: null,
    maxDate: null,
  });

  const emit = defineEmits<{
    (e: "change", value: string): void;
  }>();

  const state = reactive({
    menu: false,
    datePicker: null as Date | null,
    formattedDate: "",
  });

  const displayRules = computed(() => props.rules ?? []);

  /** handle clear action */
  function clearDate() {
    state.formattedDate = "";
    state.datePicker = null;
    emit("change", "");
  }

  /** handle when date selected from picker */
  function onDateSelected(value: string | Date | null) {
    if (!value) return;
    const m = moment(value);
    if (m.isValid()) {
      state.formattedDate = m.format("DD/MM/YYYY");
      emit("change", m.toISOString());
    }
  }

  /** Watch picker -> formatted */
  watch(
    () => state.datePicker,
    (value) => {
      if (value) {
        const m = moment(value);
        if (m.isValid()) {
          state.formattedDate = m.format("DD/MM/YYYY");
          emit("change", m.toISOString());
        }
      } else {
        state.formattedDate = "";
        emit("change", "");
      }
    }
  );

  /** Watch prop.date -> formatted field */
  watch(
    () => props.date,
    (value) => {
      if (value) {
        const m = moment(value);
        state.formattedDate = m.isValid() ? m.format("DD/MM/YYYY") : "";
      } else {
        state.formattedDate = "";
      }
    },
    { immediate: true }
  );

  let debounceTimer: number;
  /** Watch formatted string -> date picker */
  watch(
    () => state.formattedDate,
    (val) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (!val) return;

        const m = moment(val, "DD/MM/YYYY", true); // strict mode
        if (m.isValid()) {
          state.datePicker = m.toDate();
        } else {
          state.datePicker = null;
          showSnackbar("Invalid date format", "error");
          console.warn("Invalid date input:", val);
        }
      }, 750);
    }
  );
</script>
