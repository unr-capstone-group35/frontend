<script setup lang="ts">
import { ref, watch, onMounted } from "vue"
import { useAuthStore } from "~/stores/authStore"
import { useProfilePicStore } from "~/stores/profilePicStore"

const profilePicUpdateTrigger = ref(Date.now())

// Sample data - to be replaced with API call later
const leaderboardUsers = [
  { name: "You", points: 100 },
  { name: "User_23", points: 80 },
  { name: "User_48", points: 50 },
  { name: "User_12", points: 20 },
  { name: "User_87", points: 10 }
]

const authStore = useAuthStore()
const profilePicStore = useProfilePicStore()

// This will update the profile picture whenever this page is shown
// Either on initial mount or when returning to this page
onMounted(() => {
  refreshProfilePic()
})

// Helper function to determine if a user is the current user
const isCurrentUser = (name: string) => {
  return name === "You" || name === authStore.username
}

const refreshProfilePic = async () => {
  await profilePicStore.fetchUserProfilePic()
  profilePicUpdateTrigger.value = Date.now()
}

if (process.client) {
  const route = useRoute()
  watch(
    () => route.path,
    () => {
      if (route.path === "/leaderboard") {
        refreshProfilePic()
      }
    }
  )
}
</script>

<template>
  <div class="page-container flex">
    <!-- Left card - User stats -->
    <div class="flex w-80 flex-col p-6">
      <div class="rounded-lg bg-white p-6 dark:bg-gray-800">
        <!-- Current user(left card) -->
        <div class="mb-8 flex flex-col items-center space-y-4">
          <!-- Use normal sized ProfilePic component with key to force re-render when the profile pic changes -->
          <ProfilePic :key="`profile-pic-${profilePicUpdateTrigger}`" />
          <h2 class="text-primary text-xl font-semibold">Your Points</h2>
        </div>

        <!-- Stats Grid -->
        <div class="mb-6 grid grid-cols-2 gap-4">
          <div class="flex flex-col items-center rounded-lg bg-gray-100 p-3 dark:bg-gray-600">
            <div class="text-sm text-gray-800 dark:text-gray-200">Streak</div>
            <div class="text-xl font-bold text-black dark:text-white">0</div>
          </div>
          <div class="flex flex-col items-center rounded-lg bg-gray-100 p-3 dark:bg-gray-600">
            <div class="text-sm text-gray-800 dark:text-gray-200">Points</div>
            <div class="text-xl font-bold text-black dark:text-white">0</div>
          </div>
        </div>

        <div class="flex flex-col items-center rounded-lg bg-gray-100 p-3 dark:bg-gray-600">
          <div class="text-sm text-gray-800 dark:text-gray-200">Exercises Completed</div>
          <div class="text-xl font-bold text-black dark:text-white">0</div>
        </div>
      </div>

      <!-- Moved Dashboard Link here -->
      <NuxtLink
        to="/dashboard"
        class="bg-primary hover-primary mt-6 w-full rounded-lg px-6 py-3 text-center font-semibold text-white shadow-md transition-colors"
      >
        Back to Dashboard
      </NuxtLink>
    </div>

    <!-- Leaderboard(right card) -->
    <div class="flex-1 p-6">
      <div class="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <h2 class="text-primary mb-6 text-2xl font-bold">Leaderboard</h2>

        <div class="space-y-4">
          <div
            v-for="(user, index) in leaderboardUsers"
            :key="index"
            class="flex h-16 items-center justify-between rounded-lg bg-gray-100 p-4 dark:bg-gray-600"
            :class="{
              'border-2 border-yellow-500': index === 0,
              'border-2 border-gray-300': index === 1,
              'border-2 border-amber-600': index === 2,
              border: index > 2
            }"
          >
            <div class="flex items-center space-x-4">
              <span class="w-8 text-center text-xl font-bold text-gray-700 dark:text-white">{{ index + 1 }}</span>

              <!-- Use small ProfilePic for current user, default icon for others -->
              <div v-if="isCurrentUser(user.name)" class="flex-shrink-0">
                <ProfilePic :key="`leaderboard-${index}-${profilePicUpdateTrigger}`" :small="true" />
              </div>
              <div v-else class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-500">
                <svg class="h-6 w-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>

              <span class="text-lg text-gray-800 dark:text-white">{{ user.name }}</span>
            </div>

            <span class="text-lg font-semibold text-gray-700 dark:text-white">{{ user.points }} points</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
