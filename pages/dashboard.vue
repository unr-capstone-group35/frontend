<!-- pages/dashboard.vue -->
<template>
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">Dashboard</h1>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p class="text-gray-600 dark:text-gray-300">
            Welcome, {{ authStore.user?.username }}!
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useAuthStore } from '~/stores/authStore'
  
  // Middleware declaration
  definePageMeta({
    middleware: ['auth']
  })
  
  const authStore = useAuthStore()
  
  </script>