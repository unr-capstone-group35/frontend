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

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/learn', '/start-learning']
  const authRoutes = ['/signin', '/signup']

  // If token is invalid and trying to access protected route
  if (!authStore.isTokenValid && protectedRoutes.includes(to.path)) {
    authStore.clearSession() // Clear any invalid session data
    return navigateTo('/signin')
  }

  // If authenticated and trying to access auth pages
  if (authStore.isTokenValid && authRoutes.includes(to.path)) {
    return navigateTo('/dashboard')
  }
})