// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2026-01-27",
  devtools: { enabled: true },
  modules: [
    process.env.VERCEL ? "nuxt-dashboard-ui" : "../../packages/ui/src/module",
  ],
});
