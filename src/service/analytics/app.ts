import requst from "@/plugins/request";

export async function getAppList(params: object): Promise<EmptyObjectType> {
  const res = await requst.get(`/app/getAppList`, {
    params,
  });
  return res;
}

export async function createApp(params: object): Promise<EmptyObjectType> {
  const res = await requst.post(`/app/createApp`, params);
  return res;
}
export async function updateApp(params: object): Promise<EmptyObjectType> {
  const res = await requst.put(`/app/updateApp`, params);
  return res;
}

export async function findAppById(params: object): Promise<EmptyObjectType> {
  const res = await requst.get(`/app/findApp`, params);
  return res;
}

export async function deleteApp(params: object): Promise<EmptyObjectType> {
  const res = await requst.delete(`/app/deleteApp`, { data: params });
  return res;
}
