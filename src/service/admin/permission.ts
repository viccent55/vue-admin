import requst from "@/plugins/request";

// get menu
export async function getPermission(param: object): Promise<EmptyObjectType> {
  const res = await requst.post("/menu/getMenuList", param);
  return res;
}

export async function getPolicyPath(param: object): Promise<EmptyObjectType> {
  const res = await requst.post(`/casbin/getPolicyPathByAuthorityId`, param);
  return res;
}

export async function getAllApis(): Promise<EmptyObjectType> {
  const res = await requst.post(`/api/getAllApis`);
  return res;
}

export async function getBaseMenuTree(param: object): Promise<EmptyObjectType> {
  const res = await requst.post(`/menu/getBaseMenuTree`, param);
  return res;
}
