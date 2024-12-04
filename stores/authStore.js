// stores/authStore.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    error: null
  }),

  actions: {
    async signup(email, username, password) {
      try {
        const response = await fetch('http://localhost:8080/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
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

        // Try to parse the successful response
        try {
          const user = JSON.parse(data)
          this.user = user
          this.isAuthenticated = true
          this.error = null
          
          // Navigate to dashboard if it exists
          try {
            await navigateTo('/dashboard')
          } catch (e) {
            console.log('Dashboard page not found, but signup was successful')
          }
        } catch (e) {
          console.error('Error parsing success response:', e)
        }
      } catch (err) {
        this.error = err.message
        throw err
      }
    },

    async signin(username, password) {
        try {
          const response = await fetch('http://localhost:8080/api/signin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username,
              password
            })
          })
  
          if (!response.ok) {
            const error = await response.text()
            throw new Error(error || 'Invalid username or password')
          }
  
          const user = await response.json()
          this.user = user
          this.isAuthenticated = true
          this.error = null
          
          // Navigate to dashboard after successful signin
          navigateTo('/dashboard')
        } catch (err) {
          this.error = err.message
          throw err
        }
    },
  
    clearError() {
      this.error = null
    }
  }
})