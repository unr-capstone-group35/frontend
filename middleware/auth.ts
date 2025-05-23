export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  /*
  // for debugging
  console.log("Auth middleware running:", {
    path: to.path,
    isAuthenticated: authStore.isAuthenticated,
    hasToken: !!authStore.token,
    tokenExpiry: authStore.tokenExpiry
  })
    */

  // Initialize auth state from cookies
  authStore.initializeFromCookie();

  /*
  // for debugging
  console.log("After initialization:", {
    isAuthenticated: authStore.isAuthenticated,
    hasToken: !!authStore.token
  })
    */

  // Define protected routes
  const protectedRoutes = ["/dashboard", "/learn", "/start-learning"];
  const authRoutes = ["/signin", "/signup", "/forgot-password"];

  // If token is invalid and trying to access protected route
  if (!authStore.isTokenValid && protectedRoutes.includes(to.path)) {
    authStore.clearSession(); // Clear any invalid session data
    return navigateTo("/signin");
  }

  // If authenticated and trying to access auth pages
  if (authStore.isTokenValid && (authRoutes.includes(to.path) || to.path.startsWith("/reset-password"))) {
    return navigateTo("/dashboard");
  }
});
