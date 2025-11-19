<template>
  <v-dialog
    v-model="state.isOpen"
    max-width="750px"
    scrollable
  >
    <v-card
      flat
      color="surface-varaint"
    >
      <v-table>
        <tbody>
          <tr
            v-for="header in state.headers"
            :key="header.value"
          >
            <th class="font-weight-bold">{{ header.title }}:</th>
            <td
              v-for="item in state.data"
              :key="item.name + header.value"
            >
              <template v-if="header.key === 'image'">
                <v-avatar
                  class="my-2"
                  size="60px"
                  rounded="lg"
                >
                  <v-img :src="item[header.value]" />
                </v-avatar>
              </template>
              <template v-else>{{ item[header.value] }}</template>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  const state = reactive({
    isOpen: false,
    headers: [] as EmptyObjectType,
    data: [] as EmptyArrayType,
  });
  defineExpose({
    open: (header: EmptyObjectType, data: EmptyObjectType) => {
      state.isOpen = true;
      state.headers = header;
      state.data = [data];
    },
  });
</script>
