// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

import { userType } from './config/sidebase-auth';

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  css: ['~/assets/css/tailwind.css', 'vue-sonner/style.css'],
  vite: {
    plugins: [tailwindcss()],
  },

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui',
  },

  runtimeConfig: {
    public: {
      appUrl: process.env.NUXT_PUBLIC_APP_URL,
      apiUrl: process.env.NUXT_PUBLIC_API_URL,
      defaultLocale: process.env.NUXT_PUBLIC_DEFAULT_LOCALE || 'en',
    },
  },

  modules: [
    '@sidebase/nuxt-auth',
    ['@pinia/nuxt', { autoImports: ['defineStore'] }],
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    'shadcn-nuxt',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
  ],

  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: '',
    storage: 'cookie',
  },

  imports: {
    dirs: ['stores', 'types', 'lib'],
  },

  // @sidebase/nuxt-auth configuration
  auth: {
    originEnvKey: 'NUXT_PUBLIC_API_URL',
    // important. trailing slash identifies url as external
    baseURL: process.env.NUXT_PUBLIC_API_URL + '/',
    provider: {
      type: 'local',
      endpoints: {
        getSession: { path: 'v1/app/auth/user', method: 'get' },
      },
      token: {
        maxAgeInSeconds: process.env.NUXT_AUTH_TOKEN_LIFETIME
          ? Number(process.env.NUXT_AUTH_TOKEN_LIFETIME)
          : 60 * 60 * 24 * 7, // 7 days
      },
      session: {
        dataType: userType,
      },
    },
  },

  i18n: {
    defaultLocale: (process.env.NUXT_PUBLIC_DEFAULT_LOCALE || 'en') as
      | 'en'
      | 'ar',
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.ts' },
      {
        code: 'ar',
        language: 'ar',
        name: 'العربية',
        file: 'ar.ts',
        dir: 'rtl',
      },
    ],
    lazy: true,
    baseUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
});