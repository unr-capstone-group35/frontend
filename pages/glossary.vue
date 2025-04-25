<script setup>
// Add authentication middleware to ensure user data is loaded
definePageMeta({
  middleware: ["auth"]
})

// Import and initialize all necessary data
import { onMounted } from "vue"
import { useAuthStore } from "~/stores/authStore"
import { useProgressStore } from "~/stores/progressStore"
import { useProfilePicStore } from "~/stores/profilePicStore"

// Initialize the necessary stores
const authStore = useAuthStore()
const progressStore = useProgressStore()
const profilePicStore = useProfilePicStore()

// Initialize data on component mount
onMounted(async () => {
  // Ensure user data is loaded
  if (authStore.isAuthenticated) {
    // Load user profile data - using the correct function name from your store
    await profilePicStore.fetchUserProfilePic()

    console.log("User authenticated in glossary view", authStore.user)
  }
})
</script>

<template>
  <div>
    <GlossaryItem />
  </div>
</template>
