import requst from "@/plugins/request";

// get roles
export function getUserList(param: object): Promise<EmptyObjectType> {
  return requst.post("/user/getUserList", param);
}
export function createUser(param: object): Promise<EmptyObjectType> {
  return requst.post("/user/admin_register", param);
}
export function updateUser(param: object): Promise<EmptyObjectType> {
  return requst.put("/user/setUserInfo", param);
}

export function deleteUser(param: object): Promise<EmptyObjectType> {
  return requst.delete("/user/deleteUser", { data: param });
}
