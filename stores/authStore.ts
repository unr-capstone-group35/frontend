import { useNuxt } from "nuxt/kit"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    username: "",
    email: "",
    isAuthenticated: false,
    error: "",
    token: "",
    tokenExpiry: ""
  }),

  getters: {
    isTokenValid: state => {
      if (state.token == "" || state.tokenExpiry == "") return false
      return new Date(state.tokenExpiry) > new Date()
    }
  },

  actions: {
    async signup(email: string, username: string, password: string) {
      this.error = ""
      try {
        await useNuxtApp().$api("http://localhost:8080/api/register", {
          method: "POST",
          body: {
            email: email,
            username: username,
            password: password
          }
        })

        await this.signin(username, password)
      } catch (err: any) {
        this.error = err.data
        throw err
      }
    },

    async signin(username: string, password: string) {
      this.error = ""
      interface SignInResponse {
        username: string
        email: string
        token: string
        expiresAt: string // make date eventually
      }
      try {
        const signInResponse = await useNuxtApp().$api<SignInResponse>("http://localhost:8080/api/signin", {
          method: "POST",
          body: {
            username: username,
            password: password
          }
        })

        // Store session data
        this.setSession(signInResponse.token, signInResponse.expiresAt, signInResponse.username, signInResponse.email)

        await navigateTo("/dashboard")
      } catch (err: any) {
        this.error = err.data
        throw err
      }
    },

    async logout() {
      this.error = ""
      try {
        await useNuxtApp().$api("http://localhost:8080/api/logout", {
          method: "POST"
        })
      } catch (error: any) {
        this.error = error.data
        console.error(this.error)
      } finally {
        this.clearSession()
        await navigateTo("/signin")
      }
    },

    initializeFromCookie() {
      try {
        const tokenCookie = useCookie("session_token")
        const tokenExpiryCookie = useCookie("token_expiry")
        const userCookie = useCookie<{ username: string; email: string }>("user")

        if (tokenCookie.value && tokenExpiryCookie.value && userCookie.value) {
          try {
            this.token = tokenCookie.value
            this.tokenExpiry = tokenExpiryCookie.value
            this.username = userCookie.value.username
            this.email = userCookie.value.email
            this.isAuthenticated = true
          } catch (e) {
            console.error("Error parsing user data:", e)
            this.clearSession()
          }
        } else {
          this.clearSession()
        }
      } catch (e) {
        console.error("Error initializing from cookies:", e)
        this.clearSession()
      }
    },

    setSession(token: string, expiry: string, username: string, email: string) {
      try {
        const tokenCookie = useCookie("session_token", {
          maxAge: Math.floor((new Date(expiry).valueOf() - new Date().valueOf()) / 1000),
          secure: true,
          sameSite: "strict"
        })
        const tokenExpiryCookie = useCookie("token_expiry", {
          maxAge: Math.floor((new Date(expiry).valueOf() - new Date().valueOf()) / 1000),
          secure: true,
          sameSite: "strict"
        })
        const userCookie = useCookie("user", {
          maxAge: Math.floor((new Date(expiry).valueOf() - new Date().valueOf()) / 1000),
          secure: true,
          sameSite: "strict"
        })

        tokenCookie.value = token
        tokenExpiryCookie.value = expiry
        userCookie.value = JSON.stringify({ username: username, email: email })

        this.token = token
        this.tokenExpiry = expiry
        this.username = username
        this.email = email
        this.isAuthenticated = true
      } catch (e) {
        console.error("Error setting session:", e)
        this.clearSession()
      }
    },

    clearSession() {
      try {
        const tokenCookie = useCookie("session_token")
        const tokenExpiryCookie = useCookie("token_expiry")
        const userCookie = useCookie("user")

        tokenCookie.value = null
        tokenExpiryCookie.value = null
        userCookie.value = null

        this.token = ""
        this.tokenExpiry = ""
        this.username = ""
        this.email = ""
        this.isAuthenticated = false
      } catch (e) {
        console.error("Error clearing session:", e)
      }
    }
  }
})
