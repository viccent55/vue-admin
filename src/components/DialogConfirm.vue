<script setup lang="ts">
  import useVariables from "@/composables/useVariables";

  const dialog = ref(false);
  const confirmed = ref(false);
  let resolve: (value: boolean) => void;

  const state = reactive({
    item: null as EmptyObjectType | null,
    loading: false,
    message: "",
  });

  const { locale } = useVariables();
  watch(dialog, (v) => {
    if (!v) {
      resolve(confirmed.value);
    }
  });
  function open(text: string, item: EmptyObjectType) {
    confirmed.value = false;
    dialog.value = true;
    state.message = text;
    state.item = item;

    return new Promise<boolean>((resolveFn) => {
      resolve = resolveFn;
    });
  }
  const emit = defineEmits(["cancel", "confirm"]);

  function confirm() {
    confirmed.value = true;
    dialog.value = false;
    emit("confirm", state.item);
  }
  function cancel() {
    confirmed.value = false;
    dialog.value = false;
    emit("cancel", state.item);
  }
  defineExpose({ open });
</script>

<template>
  <v-dialog
    v-model="dialog"
    max-width="400px"
  >
    <v-card style="z-index: -1">
      <v-card-text class="font-weight-bold d-flex text-h6 pb-0">
        <v-icon
          class="mr-2"
          color="warning"
        >
          $warning
        </v-icon>
        {{ locale.t("warning") }}
      </v-card-text>
      <v-card-text class="text-center pa-2 text-body-1">
        {{ locale.t(state.message) }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="grey"
          density="comfortable"
          @click="cancel"
        >
          {{ locale.t("cancel") }}
        </v-btn>
        <v-btn
          color="primary"
          density="comfortable"
          @click="confirm"
        >
          {{locale.t("confirm")}}
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
