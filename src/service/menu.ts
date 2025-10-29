import requst from "@/plugins/request";

// get menu
export async function menus(param: object): Promise<EmptyObjectType> {
  const res =  await requst.post("/menu/getMenuList", param);
  return res
}

export async function addMenu(param: object): Promise<EmptyObjectType> {
  const res =  await requst.post("/menu/addMenuAuthority", param);
  return res
}

export async function updateMenu(param: object): Promise<EmptyObjectType> {
  const res =  await requst.post("/menu/update", param);
  return res
}

export async function getBaseMenuTree(param: object): Promise<EmptyObjectType> {
  const res =  await requst.post("/menu/getBaseMenuTree", param);
  return res
}

