import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv, type ConfigEnv } from "vite";
import Vue from "@vitejs/plugin-vue";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import VueRouter from "unplugin-vue-router/vite";
import { VueRouterAutoImports } from "unplugin-vue-router";
import regexpPlugin from "rollup-plugin-regexp";
import * as mdicons from "@mdi/js";

const mdi: Record<string, string> = {};
Object.keys(mdicons).forEach((key) => {
  const value = (mdicons as Record<string, string>)[key];
  mdi[
    key
      .replace(/([A-Z])/g, "-$1")
      .toLowerCase()
      .replace(/([0-9]+)/g, "-$1")
  ] = value;
});

// https://vitejs.dev/config/
const viteConfig = defineConfig((mode: ConfigEnv) => {
  const env = loadEnv(mode.mode, process.cwd());
  return {
    plugins: [
      regexpPlugin({
        exclude: ["node_modules/**"],
        find: /\b(?<![/\w])(mdi-[\w-]+)\b(?!\.)/,
        replace: (match: string) => {
          if (mdi[match]) {
            return mdi[match];
          } else {
            console.warn("[plugin-regexp] No matched svg icon for " + match);
            return match;
          }
        },
        sourcemap: false,
      }),
      VueRouter({ importMode: "sync" }),
      Vue({
        template: { transformAssetUrls },
        features: { propsDestructure: true },
      }),

      Vuetify({ autoImport: true }),
      Components({ dts: "./src/components.d.ts", types: [] }),
      AutoImport({
        imports: [
          "vue",
          "pinia",
          VueRouterAutoImports,
          {
            vuetify: [
              "useTheme",
              "useRtl",
              "useLocale",
              "useDisplay",
              "useLayout",
            ],
          },
        ],
        dts: "src/auto-imports.d.ts",
        dirs: ["src/stores"],
      }),
    ],
    css: {
      devSourcemap: true,
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      host: "0.0.0.0",
      port: env.VITE_PORT as unknown as number,
      open: false,
      hmr: true,
      proxy: {
        "/api": {
          target: env.VITE_API_URL,
          ws: true,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
      allowedHosts: true,
    },
  };
});
export default viteConfig;
