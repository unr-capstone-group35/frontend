// stores/authStore.js
import { defineStore } from 'pinia'
import { useCookie } from '#app'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    error: null,
    token: null,
    tokenExpiry: null
  }),

  getters: {
    isTokenValid: (state) => {
      if (!state.token || !state.tokenExpiry) return false
      return new Date(state.tokenExpiry) > new Date()
    }
  },

  actions: {
    async signup(email, username, password) {
      try {
        const response = await fetch('http://localhost:8080/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            email,
            username,
            password
          })
        })

        const data = await response.text()
        let errorMessage = data

        try {
          const jsonData = JSON.parse(data)
          if (jsonData.error) {
            errorMessage = jsonData.error
          } else {
            // If signup successful, sign in
            await this.signin(username, password)
            return
          }
        } catch (e) {
          // If it's not JSON, use text as is
        }

        if (!response.ok) {
          if (response.status === 409) {
            throw new Error('Username already exists')
          } else if (response.status === 400) {
            throw new Error(errorMessage || 'Invalid input')
          } else {
            throw new Error(errorMessage || 'Failed to sign up')
          }
        }
      } catch (err) {
        this.error = err.message
        throw err
      }
    },

    initializeFromCookie() {
      try {
        const tokenCookie = useCookie('session_token')
        const tokenExpiryCookie = useCookie('token_expiry')
        const userCookie = useCookie('user')

        if (tokenCookie.value && tokenExpiryCookie.value && userCookie.value) {
          try {
            const userData = typeof userCookie.value === 'string' 
              ? JSON.parse(userCookie.value)
              : userCookie.value

            this.token = tokenCookie.value
            this.tokenExpiry = tokenExpiryCookie.value
            this.user = userData
            this.isAuthenticated = true
          } catch (e) {
            console.error('Error parsing user data:', e)
            this.clearSession()
          }
        } else {
          this.clearSession()
        }
      } catch (e) {
        console.error('Error initializing from cookies:', e)
        this.clearSession()
      }
    },

    setSession(token, expiry, user) {
      try {
        const tokenCookie = useCookie('session_token', {
          maxAge: Math.floor((new Date(expiry) - new Date()) / 1000),
          secure: true,
          sameSite: 'strict'
        })
        const tokenExpiryCookie = useCookie('token_expiry', {
          maxAge: Math.floor((new Date(expiry) - new Date()) / 1000),
          secure: true,
          sameSite: 'strict'
        })
        const userCookie = useCookie('user', {
          maxAge: Math.floor((new Date(expiry) - new Date()) / 1000),
          secure: true,
          sameSite: 'strict'
        })

        tokenCookie.value = token
        tokenExpiryCookie.value = expiry
        userCookie.value = JSON.stringify(user)

        this.token = token
        this.tokenExpiry = expiry
        this.user = user
        this.isAuthenticated = true
      } catch (e) {
        console.error('Error setting session:', e)
        this.clearSession()
      }
    },

    clearSession() {
      try {
        const tokenCookie = useCookie('session_token')
        const tokenExpiryCookie = useCookie('token_expiry')
        const userCookie = useCookie('user')

        tokenCookie.value = null
        tokenExpiryCookie.value = null
        userCookie.value = null

        this.token = null
        this.tokenExpiry = null
        this.user = null
        this.isAuthenticated = false
      } catch (e) {
        console.error('Error clearing session:', e)
      }
    },

    async signin(username, password) {
      try {
        const response = await fetch('http://localhost:8080/api/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            username,
            password
          })
        })

        if (!response.ok) {
          const error = await response.text()
          throw new Error(error || 'Invalid username or password')
        }

        const data = await response.json()
        
        // Store session data
        this.setSession(data.token, data.expiresAt, {
          username: data.username,
          email: data.email
        })
        
        this.error = null
        await navigateTo('/dashboard')
      } catch (err) {
        this.error = err.message
        throw err
      }
    },

    async logout() {
      try {
        if (this.token) {
          await fetch('http://localhost:8080/api/logout', {
            method: 'POST',
            headers: {
              'X-Session-Token': this.token
            },
            credentials: 'include',
          })
        }
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.clearSession()
        await navigateTo('/signin')
      }
    },

    getAuthHeaders() {
      return this.token ? {
        'X-Session-Token': this.token
      } : {}
    }
  }
})