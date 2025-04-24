export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()

  const api = $fetch.create({
    async onRequest({ request, options }) {
      options.headers.set("Content-Type", "application/json")
      
      // Check if this is a protected endpoint
      const isProtectedUrl = request.toString().includes('/api/users/') || 
                            request.toString().includes('/api/points/') ||
                            request.toString().includes('/api/stats/');
      
      // Skip these requests entirely if not logged in
      if (isProtectedUrl && (!authStore.isAuthenticated || !authStore.token)) {
        console.log("Not authenticated");
        return Promise.reject(new Error('Not authenticated'));
      }
      
      if (authStore.isAuthenticated && authStore.token) {
        options.headers.set("Authorization", `Bearer ${authStore.token}`)
      }

      console.log(`[devfetch ${options.method} request]`, request)
    },
    async onRequestError({ request, options, error }) {
      console.error("[devfetch request error] ", request, error)
    },
    async onResponseError({ request, options, response }) {
      console.error("[devfetch response error]", request, response.status, response.body)
    }
  })
  return {
    provide: {
      api
    }
  }
})