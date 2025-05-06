// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['vuetify/styles', '~/assets/css/main.css'],

  build: {
    transpile: ['vuetify']
  },

  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],

  vite: {
    define: {
      'process.env.DEBUG': false
    }
  },

  plugins: [{ src: '~/plugins/highcharts.client.js', mode: 'client' }],

  compatibilityDate: '2025-04-07'
});
