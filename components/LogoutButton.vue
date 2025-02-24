<script setup>
import { useAuthStore } from "~/stores/authStore"

const authStore = useAuthStore()

const handleLogout = async () => {
  try {
    await authStore.logout()
  } catch (error) {
    console.error("Logout failed:", error)
  }
}
</script>

<template>
  <button @click="handleLogout" class="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700">
    Logout
  </button>
</template>
