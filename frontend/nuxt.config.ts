// https://nuxt.com/docs/api/configuration/nuxt-config
import {useAuthStore} from "./store/auth-store";

export default defineNuxtConfig({
  head: {
    link: [
      // Add this link for Bootstrap Icons
      {
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.7.2/font/bootstrap-icons.min.css'
      }
    ]
  },
  plugins: [{ src: '~/plugins/bootstrap.js', mode: 'client' }],
  css: ['bootstrap/dist/css/bootstrap.min.css'],
  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL || 'http://localhost:8080/ProjDAE_Java/api'
    }
  },
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt'
  ],
  router: {
    middleware: ['auth-middleware.global'],
  }
})
