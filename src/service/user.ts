import requst from "@/plugins/request";

// get roles
export function roles(param: object): Promise<EmptyObjectType> {
  return requst.post("/base/login", param);
}

// get menus
export function menus(param: object): Promise<EmptyObjectType> {
  return requst.post("/base/login", param);
}
