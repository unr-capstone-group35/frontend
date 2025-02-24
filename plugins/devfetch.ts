export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()

  const api = $fetch.create({
    baseURL: useRuntimeConfig().public.apiBase,
    async onRequest({ request, options }) {
      options.headers.set("Content-Type", "application/json")
      if (authStore.isAuthenticated) {
        options.headers.set("x-api-key", authStore.token)
      }

      console.log(`[devfetch] ${options.method} request`, request)
    },
    async onRequestError({ request, error }) {
      console.error("[devfetch] request error", request, error)
    },
    async onResponseError({ request, error }) {
      console.error("[devfetch] response error", request, error)
    }
  })
  return {
    provide: {
      api
    }
  }
})
