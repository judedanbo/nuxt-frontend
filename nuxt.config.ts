// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.API_BASE_URL,
      API_USER: process.env.API_USER,
      API_PASSWORD: process.env.API_PASSWORD,
    },
  },
  extends: ['@nuxt/ui-pro'],
  modules: ['@nuxt/ui'],
  ui: {
    icons: ['heroicons', 'simple-icons']
  },
  devtools: {
    enabled: true
  }
})
