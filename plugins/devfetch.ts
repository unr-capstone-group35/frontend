export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()

  const api = $fetch.create({
    baseURL: useRuntimeConfig().public.apiBase,
    async onRequest({ request, options }) {
      options.headers.set("Content-Type", "application/json")

      if (authStore.isAuthenticated) {
        options.headers.set("Authorization", `Bearer ${authStore.token}`)
      }

      console.log(`[devfetch] ${options.method} request`, request)
    },
    async onRequestError({ request, options, error }) {
      console.error("[devfetch request error]", request, error)
    },
    async onResponseError({ request, options, response }) {
      console.error("[devfetch response error]", request, response._data, response.status)
    }
  })
  return {
    provide: {
      api
    }
  }
})
