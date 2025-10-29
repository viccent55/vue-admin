import requst from "@/plugins/request";

export async function getFileList(params: object): Promise<EmptyObjectType> {
  const res = await requst.post(`/fileUploadAndDownload/getFileList`, params);
  return res;
}

export async function upload(formData: FormData): Promise<EmptyObjectType> {
  const res = await requst.post(`/fileUploadAndDownload/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res;
}

export async function deletePhoto(params: object): Promise<EmptyObjectType> {
  const res = await requst.post(`/fileUploadAndDownload/deleteFile`, params);
  return res;
}
