import requst from "@/plugins/request";

export async function getChannelList(params: object): Promise<EmptyObjectType> {
  const res = await requst.get(`/channel/getChannelList`, {
    params,
  });
  return res;
}
export async function getChannelAppIds(params: object): Promise<EmptyObjectType> {
  const res = await requst.get(`/channel/getChannelAppIds`, {
    params,
  });
  return res;
}
export async function getParentChannelList(): Promise<EmptyObjectType> {
  const res = await requst.get(`/channel/getParentChannelList`);
  return res;
}

export async function createChannel(params: object): Promise<EmptyObjectType> {
  const res = await requst.post(`/channel/createChannel`, params);
  return res;
}
export async function updateChannel(params: object): Promise<EmptyObjectType> {
  const res = await requst.put(`/channel/updateChannel`, params);
  return res;
}
export async function setChannelApps(params: object): Promise<EmptyObjectType> {
  const res = await requst.put(`/channel/setChannelApps`, params);
  return res;
}

export async function deleteChannel(params: object): Promise<EmptyObjectType> {
  const res = await requst.delete(`/channel/deleteChannel`, {
    data: params,
  });
  return res;
}
