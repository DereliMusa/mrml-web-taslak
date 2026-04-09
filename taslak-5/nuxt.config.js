// nuxt.config.js
export default defineNuxtConfig({
  // JavaScript -- TypeScript devre disi
  typescript: { strict: false, shim: false },

  // Global CSS -- sadece ana site
  css: [
    '~/assets/css/main.css',
  ],


  // Nitro -- SQLite server-side calissin, uploads public'de
  nitro: {
    publicAssets: [
      { dir: 'public', maxAge: 3600 },
    ],
  },

  // Nuxt dev sunucusu (prod'da 3737 portunda calistir)
  devServer: {
    port: 3737,
  },

  // Sayfa gecislerinde scroll en uste
  router: {
    options: {
      scrollBehaviorType: 'smooth',
    },
  },

  // Head varsayilanlari
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'MrML Lab',
      meta: [
        { name: 'description', content: 'MrML Arastirma Laboratuvari -- Makine Ogrenimi & Robotik' },
      ],
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Hubot+Sans:ital,wght@0,300..900;1,300..900&family=Mona+Sans:ital,wght@0,200..900;1,200..900&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
        },
      ],
    },
  },

  compatibilityDate: '2025-04-09',
})
