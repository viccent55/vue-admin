import requst from "@/plugins/request";

export async function getMenuAuthority(
  params: object
): Promise<EmptyObjectType> {
  const res = await requst.post(`/menu/getMenuAuthority`, params);
  return res;
}
export async function setDataAuthority(
  params: object
): Promise<EmptyObjectType> {
  const res = await requst.post(`/authority/setDataAuthority`, params);
  return res;
}
