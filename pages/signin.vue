<template>
  <div class="h-[calc(100vh-115px)] bg-gray-100 dark:bg-gray-900 flex flex-col">
    <div class="flex-1 flex items-center justify-center w-full">
      <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">Sign In</h2>
        
        <!-- Show error message if exists -->
        <div v-if="authStore.error" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {{ authStore.error }}
        </div>
        
        <form @submit.prevent="handleSignIn">
          <div class="mb-4">
            <label class="block text-gray-700 dark:text-gray-200 font-medium mb-2" for="username">Username</label>
            <input
              v-model="username"
              type="text"
              id="username"
              class="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 
              dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="Enter your username"
              required
            />
          </div>

          <div class="mb-6">
            <label class="block text-gray-700 dark:text-gray-200 font-medium mb-2" for="password">Password</label>
            <input
              v-model="password"
              type="password"
              id="password"
              class="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 
              dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <p class="mt-4 text-center text-gray-600 dark:text-gray-300">
          Don't have an account?
          <NuxtLink to="/signup" class="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
            Sign up
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '~/stores/authStore'

const username = ref('')
const password = ref('')
const isLoading = ref(false)
const authStore = useAuthStore()

async function handleSignIn() {
  try {
    isLoading.value = true
    await authStore.signin(username.value, password.value)
  } catch (error) {
    console.error('Signin failed:', error)
  } finally {
    isLoading.value = false
  }
}
</script>