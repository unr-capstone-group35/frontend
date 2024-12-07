// middleware/auth.ts
import { useAuthStore } from '~/stores/authStore'

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  console.log('Auth middleware running:', {
    path: to.path,
    isAuthenticated: authStore.isAuthenticated,
    hasToken: !!authStore.token,
    tokenExpiry: authStore.tokenExpiry
  })

  // Initialize auth state from cookies
  authStore.initializeFromCookie()

  console.log('After initialization:', {
    isAuthenticated: authStore.isAuthenticated,
    hasToken: !!authStore.token
  })

  // If token is invalid and trying to access protected route
  if (!authStore.isTokenValid && to.path !== '/signin' && to.path !== '/signup') {
    authStore.clearSession() // Clear any invalid session data
    return navigateTo('/signin')
  }

  // If authenticated and trying to access auth pages
  if (authStore.isTokenValid && (to.path === '/signin' || to.path === '/signup')) {
    return navigateTo('/dashboard')
  }
})