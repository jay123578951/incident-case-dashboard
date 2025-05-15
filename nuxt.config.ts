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
    },
    server: {
      allowedHosts: ['d01b-2001-b400-e2d8-7d68-541f-a4b5-5d47-6fe7.ngrok-free.app'],
    }
  },

  plugins: [{ src: '~/plugins/highcharts.client.js', mode: 'client' }],

  compatibilityDate: '2025-04-07'
});
