import requst from "@/plugins/request";

export async function getAdPositionList(
  params: object
): Promise<EmptyObjectType> {
  const res = await requst.get(`/adPosition/getAdPositionList`, {
    params,
  });
  return res;
}
export async function createAdPosition(
  params: object
): Promise<EmptyObjectType> {
  const res = await requst.post(`/adPosition/createAdPosition`, params);
  return res;
}
export async function updateAdPositionList(
  params: object
): Promise<EmptyObjectType> {
  const res = await requst.put(`/adPosition/updateAdPosition`, params);
  return res;
}

export async function deleteAdPosition(
  params: object
): Promise<EmptyObjectType> {
  const res = await requst.delete(`/adPosition/deleteAdPosition`, {
    data: params,
  });
  return res;
}
export async function deleteAdPositionByIds(
  params: object
): Promise<EmptyObjectType> {
  const res = await requst.delete(`/channel/deleteAdPositionByIds`, params);
  return res;
}
