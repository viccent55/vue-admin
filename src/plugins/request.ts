import axios, { type AxiosInstance } from "axios";
import { Session } from "@/utils/storage";
import qs from "qs";
import { Notify } from "@/stores/notification";

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.PROD
    ? import.meta.env.VITE_API_URL // your actual API domain
    : "/api",
  timeout: 50000,
  headers: { "Content-Type": "application/json" },
  paramsSerializer: {
    serialize(params) {
      return qs.stringify(params, { allowDots: true });
    },
  },
});

// Adding a request interceptor
service.interceptors.request.use(
  (config) => {
    // What to do before sending a request token
    if (Session.get("token")) {
      config.headers!["Authorization"] = `${Session.get("token")}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code && res.code !== 0) {
      // `token` Expired or the account has been logged in elsewhere
      if (res.code === 401 || res.code === 4001) {
        Session.clear(); // Clear all temporary browser caches
        window.location.href = "/";
        Notify.error("登录状态已过期，请重新登录");
      }
      return Promise.reject(service.interceptors.response);
    } else {
      return res;
    }
  },
  (error) => {
    // Do something with the response error
    if (error.message.indexOf("timeout") != -1) {
      Notify.error("网络超时");
    } else if (error.message == "Network Error") {
      Notify.error("网络连接错误");
    } else {
      if (error.response?.data) Notify.info(error.response.statusText);
      else Notify.error("接口路径找不到");
    }
    return Promise.reject(error);
  }
);

export default service;
