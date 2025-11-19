import requst from "@/plugins/request";
import qs from "qs";

export async function getProducts(params: object): Promise<EmptyObjectType> {
  const res = await requst.get(`/product/getProductList`, {
    params,
    paramsSerializer: {
      serialize: (params) => qs.stringify(params, { arrayFormat: "brackets" }),
    },
  });
  return res;
}

export async function createProduct(params: object): Promise<EmptyObjectType> {
  const res = await requst.post(`/product/createProduct`, params);
  return res;
}
export async function updateProduct(params: object): Promise<EmptyObjectType> {
  const res = await requst.put(`/product/updateProduct`, params);
  return res;
}

export async function findAppById(params: object): Promise<EmptyObjectType> {
  const res = await requst.get(`/app/findApp`, params);
  return res;
}

export async function deleteProduct(params: object): Promise<EmptyObjectType> {
  const res = await requst.delete(`/product/deleteProduct`, { params });
  return res;
}
export async function deleteProductByIds(params: object): Promise<EmptyObjectType> {
  const res = await requst.delete(`/product/deleteProductByIds`, { params });
  return res;
}
