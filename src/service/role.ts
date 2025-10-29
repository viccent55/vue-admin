import requst from "@/plugins/request";

// get menu
export async function roles(param: object): Promise<EmptyObjectType> {
  const res = await requst.post("/authority/getAuthorityList", param);
  return res;
}

export async function create(param: object): Promise<EmptyObjectType> {
  const res = await requst.post("/authority/createAuthority", param);
  return res;
}

export async function update(param: object): Promise<EmptyObjectType> {
  const res = await requst.put("/authority/updateAuthority", param);
  return res;
}

export async function deleteItem(param: object): Promise<EmptyObjectType> {
  const res = await requst.post("/authority/deleteAuthority", param);
  return res;
}
export async function setAuthority(param: object): Promise<EmptyObjectType> {
  const res = await requst.post("/authorityBtn/setAuthorityBtn", param);
  return res;
}


