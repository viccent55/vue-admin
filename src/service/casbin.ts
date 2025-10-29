import requst from "@/plugins/request";

export async function getPolicyPathByAuthorityId(
  params: object
): Promise<EmptyObjectType> {
  const res = await requst.post(`/casbin/getPolicyPathByAuthorityId`, params);
  return res;
}

export async function updateCasbin(
  params: object
): Promise<EmptyObjectType> {
  const res = await requst.post(`/casbin/updateCasbin`, params);
  return res;
}
