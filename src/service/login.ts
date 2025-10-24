import requst from "@/plugins/request";

// login
export async function login(param: object): Promise<EmptyObjectType> {
  const res =  await requst.post("/base/login", param);
  return res
}
