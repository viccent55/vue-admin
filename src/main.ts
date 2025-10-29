import { createApp } from "vue";
import App from "./App.vue";
import router from "@/routers";
import pinia from "@/plugins/pinia";
import vuetify from "@/plugins/vuetify";
import echarts from "@/plugins/echarts";
import {
  createMyLocalePlugin,
  createMyPermissionsPlugin,
} from "@/plugins/vuetify0";

const app = createApp(App);

// install in correct order
app.use(pinia);
app.use(router);
app.use(vuetify);
app.use(echarts);
app.use(createMyLocalePlugin(), createMyPermissionsPlugin()); // ✅ now store is available
app.mount("#app");
