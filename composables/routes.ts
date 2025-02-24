export const usersRoute = (userId?: string): string => {
  let route = `${useRuntimeConfig().public.apiBase}/users`

  if (typeof userId !== "undefined") {
    route += `/${userId}`
  }

  return route
}

export const signinRoute = () => {
  let route = `${useRuntimeConfig().public.apiBase}/signin`

  return route
}
export const logoutRoute = () => {
  let route = `${useRuntimeConfig().public.apiBase}/logout`

  return route
}
