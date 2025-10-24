import requst from "@/plugins/request";

// login
export function login(param: object): Promise<EmptyObjectType> {
  return requst.post("/base/login", param);
}
