
import requst from "@/plugins/request";

export async function getAppAdPositionList(params: object): Promise<EmptyObjectType> {
  const res = await requst.get(`/appAdPosition/getAppAdPositionList`, {
    params,
  });
  return res;
}

export async function createAdvertisment(params: object): Promise<EmptyObjectType> {
  const res = await requst.post(`/appAdPosition/createAppAdPosition`, params);
  return res;
}
export async function updateAdvertisment(params: object): Promise<EmptyObjectType> {
  const res = await requst.put(`/appAdPosition/updateAppAdPosition`, params);
  return res;
}

export async function reviewAdvertisment(params: object): Promise<EmptyObjectType> {
  const res = await requst.put(`/appAdPosition/reviewAppAdPosition`, params);
  return res;
}

export async function findAdvertisment(params: object): Promise<EmptyObjectType> {
  const res = await requst.get(`/appAdPosition/findAppAdPosition`, params);
  return res;
}

export async function deleteAdvertisment(params: object): Promise<EmptyObjectType> {
  const res = await requst.delete(`/appAdPosition/deleteAppAdPosition`, { data: params });
  return res;
}
