<script setup lang="ts">
  import { reactive } from "vue";
  import { upload, getFileList, deletePhoto } from "@/service/upload";

  const props = defineProps({
    modelValue: {
      type: String,
      default: "",
    },
  });
  const state = reactive({
    dialog: {
      isShowDialog: false,
    },
    files: [] as File[],
    photos: [] as any[],
    loading: false,
  });

  const emit = defineEmits(["update:modelValue", "uploaded", "fetched"]);

  const getPhotoList = async () => {
    try {
      state.loading = true;
      const res = await getFileList({ page: 1, pageSize: 100, classId: 0 });
      state.photos = res.data.list ?? [];
    } catch (e) {
      console.log(e);
    } finally {
      state.loading = false;
    }
  };
  const openDialog = async () => {
    state.dialog.isShowDialog = true;
    await getPhotoList();
  };
  // ✅ Close dialog
  const closeDialog = () => {
    state.dialog.isShowDialog = false;
    state.files = [];
  };

  // ✅ Handle upload
  async function handleUpload() {
    state.loading = true;
    if (!state.files.length) return;
    const formData = new FormData();
    formData.append("classId", "0");
    formData.append("file", state.files[0] as File);
    try {
      const res = await upload(formData);
      if (res.code === 0) {
        state.files = [];
        await getPhotoList();
      }
    } catch (err) {
      console.error(err);
    } finally {
      state.loading = false;
    }
  }
  const normalizedPhotos = computed(() =>
    state.photos.map((img: any) => ({
      ...img,
      url: img.url.startsWith("http")
        ? img.url
        : `${import.meta.env.VITE_API_URL}/${img.url}`,
    }))
  );
  const onDeletePhoto = async (item: EmptyObjectType) => {
    state.loading = true;
    try {
      const res = await deletePhoto(item);
      if (res.code === 0) {
        await getPhotoList();
      }
    } catch (e) {
      console.log(e);
    } finally {
      state.loading = false;
    }
  };
  defineExpose({
    openDialog,
  });
</script>

<template>
  <v-dialog
    v-model="state.dialog.isShowDialog"
    scrollable
    max-width="500"
  >
    <v-card
      :loading="state.loading"
      flat
    >
      <v-toolbar
        color="secondary"
        title="Upload Image"
        density="compact"
      />
      <v-card-text>
        <v-file-upload
          v-model="state.files"
          accept="image/*"
          density="compact"
          :multiple="false"
          @update:model-value="handleUpload"
        />

        <div class="d-flex flex-wrap ga-4 mt-5">
          <v-row dense>
            <v-col
              v-for="img in normalizedPhotos"
              :key="img.url"
              cols="3"
            >
              <v-card
                flat
                border
                @click="
                  emit('update:modelValue', img.url);
                  state.dialog.isShowDialog = false;
                "
              >
                <v-img
                  :key="img"
                  :src="img.url"
                  contain
                  height="100px"
                >
                  <div class="d-flex justify-end">
                    <v-btn
                      variant="outlined"
                      icon="mdi-delete"
                      density="compact"
                      @click.stop="onDeletePhoto(img)"
                    />
                  </div>
                </v-img>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn
          text
          @click="closeDialog"
        >
          Cancel
        </v-btn>
      </v-card-actions>
      <overlay-loading
        :loading="state.loading"
        contained
      ></overlay-loading>
    </v-card>
  </v-dialog>
</template>
