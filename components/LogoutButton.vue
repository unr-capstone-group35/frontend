<!-- components/LogoutButton.vue -->
<template>
    <button
      @click="handleLogout"
      class="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
    >
      Logout
    </button>
  </template>
  
  <script setup>
  import { useAuthStore } from '~/stores/authStore'
  
  const authStore = useAuthStore()
  
  const handleLogout = async () => {
    try {
      await authStore.logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }
  </script>