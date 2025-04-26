// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-08-24", // Current date
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@nuxtjs/color-mode", // No longer a dev dependency
  ],
  css: ["~/assets/css/tailwind.css"],
  colorMode: {
    preference: "dark",
    fallback: "dark",
    classSuffix: "",
  },
});
