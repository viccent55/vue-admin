import requst from "@/plugins/request";

export async function getAllApis(params: object): Promise<EmptyObjectType> {
  const res = await requst.post(`/api/getAllApis`, params);
  return res;
}

export async function getApiList(params: object): Promise<EmptyObjectType> {
  const res = await requst.post(`/api/getApiList`, params);
  return res;
}

export async function apiGroup(): Promise<EmptyObjectType> {
  const res = await requst.get(`/api/getApiGroups`);
  return res;
}

export async function deleteItem(params: object): Promise<EmptyObjectType> {
  const res = await requst.delete("/api/deleteApisByIds", { data: params });
  return res;
}

export async function createApi(params: object): Promise<EmptyObjectType> {
  const res = await requst.post(`/api/createApi`, params);
  return res;
}
export async function updateApi(params: object): Promise<EmptyObjectType> {
  const res = await requst.post(`/api/updateApi`, params);
  return res;
}
