import type { RouteRecordRaw } from "vue-router";

const staticRoutes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/login/index.vue"),
    meta: {
      title: "login",
      auth: false,
    },
  },
];
const adminRoutes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "/",
    component: () => import("@/layouts/default.vue"),
    redirect: "dashboard",
    meta: {
      isKeepAlive: true,
    },
    children: [
      // {
      //   path: '/home',
      //   name: 'home',
      //   component: () => import('@/pages/home/index.vue'),
      //   meta: {
      //     title: 'home',
      //     isKeepAlive: true,
      //     roles: ['admin', 'common'],
      //     icon: 'mdi-home-outline',
      //   },
      // },
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/pages/dashboard/index.vue"),
        meta: {
          title: "dashboard",
          isKeepAlive: true,
          roles: ["admin", "common"],
          icon: "mdi-view-dashboard-outline",
        },
      },
      {
        path: "/administrator",
        name: "admin",
        component: () => import("@/pages/administrator/index.vue"),
        redirect: "/administrator/role",
        meta: {
          title: "administrator",
          isKeepAlive: true,
          roles: ["admin", "common"],
          icon: "mdi-folder-multiple-outline",
        },
        children: [
          {
            path: "/administrator/role",
            name: "role",
            component: () => import("@/pages/administrator/role/index.vue"),
            meta: {
              title: "role",
              isKeepAlive: true,
            },
          },
          // {
          //   path: "/administrator/menu",
          //   name: "menu",
          //   component: () => import("@/pages/administrator/menu/index.vue"),
          //   meta: {
          //     title: "menu",
          //     isKeepAlive: true,
          //   },
          // },
          {
            path: "/user",
            name: "/administrator/user",
            component: () => import("@/pages/administrator/user/index.vue"),
            meta: {
              title: "user",
              isKeepAlive: true,
            },
          },
          {
            path: "/administrator/api-management",
            name: "api-management",
            component: () =>
              import("@/pages/administrator/api-management/index.vue"),
            meta: {
              title: "apiManagement",
              isKeepAlive: true,
            },
          },
        ],
      },
      {
        path: "/table",
        name: "table",
        component: () => import("@/pages/table.vue"),
        meta: {
          title: "table",
          isKeepAlive: true,
          roles: ["admin", "common"],
          icon: "mdi-folder-multiple-outline",
        },
      },
    ],
  },

  // {
  //   path: '/user/:id',
  //   name: 'User',
  //   component: () => import('@/views/User/index.vue'),
  // },
];

const notFoundAndNoPower = [
  {
    path: "/:path(.*)*",
    name: "notFound",
    component: () => import("@/layouts/default.vue"),
    meta: {
      title: "notFound",
      isHide: true,
    },
    children: [
      {
        path: "/:path(.*)*",
        name: "pageNotFound",
        component: () => import("@/pages/[...all].vue"),
        meta: {
          isHide: true,
        },
      },
    ],
  },
];
export { staticRoutes, adminRoutes, notFoundAndNoPower };
