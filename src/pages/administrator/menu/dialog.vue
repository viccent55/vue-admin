<script setup lang="ts">
  import useVariables from "@/composables/useVariables";

  definePage({
    meta: {
      title: "Menu 2-1",
      icon: "mdi-animation",
    },
  });
  const state = reactive({
    dialog: {
      isShowDialog: false,
      title: "",
      cancelText: "cancel",
      confirmText: "submit",
    },
  });
  const { locale } = useVariables();
</script>
<template>
  <v-dialog
    v-model="state.dialog.isShowDialog"
    scrollable
  >
    <v-card flat>
      <v-card-title>
        {{ locale.t(state.dialog.title) }}
      </v-card-title>
      <v-card-text>
        <div>asdf</div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="grey"
          density="comfortable"
          @click="state.dialog.isShowDialog = false"
        >
          {{ locale.t(state.dialog.cancelText) }}
        </v-btn>
        <v-btn
          color="primary"
          density="comfortable"
          @click="state.dialog.isShowDialog = false"
        >
          {{ locale.t(state.dialog.confirmText) }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
