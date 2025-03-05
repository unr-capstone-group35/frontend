<script setup lang="ts">
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(["close"])
const router = useRouter()
const authStore = useAuthStore()

const close = () => {
  emit("close")
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    close()
    router.push("/signin")
  } catch (error) {
    console.error("Logout failed:", error)
  }
}

const handleLeaderboardClick = () => {
  close()
  router.push("/leaderboard")
}

const handleDashboardClick = () => {
  close()
  router.push("/dashboard")
}

const handleGlossaryClick = () => {
  close()
  router.push("/glossary")
}
</script>

<template>
  <div>
    <!-- Background -->
    <div v-if="isOpen" @click="close" class="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity"></div>

    <!-- Sidebar -->
    <aside
      class="fixed right-0 top-0 z-50 flex h-full w-64 transform flex-col overflow-y-auto bg-white p-4 text-white shadow-md transition-transform duration-300 ease-in-out dark:bg-gray-800"
      :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <!-- close button -->
      <button
        @click="close"
        class="absolute left-2 top-2 rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-label="Close menu"
      >
        <img src="~/assets/icons/close-x.svg" alt="Close" class="h-6 w-6 dark:invert" />
      </button>

      <!-- Profile -->
      <div class="mb-8 flex flex-col items-center space-y-4">
        <div
          class="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
        >
          <svg class="h-16 w-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
        </div>

        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-300">
          {{ authStore.username || "Unknown" }}
        </h2>
      </div>

      <!-- Stats -->
      <div class="mb-6 grid grid-cols-2 gap-4">
        <div class="flex flex-col items-center rounded-lg bg-gray-200 p-3 dark:bg-gray-700">
          <div class="text-sm text-gray-800 dark:text-gray-300">Streak</div>
          <div class="text-xl font-bold text-black dark:text-white">0</div>
        </div>

        <div class="flex flex-col items-center rounded-lg bg-gray-200 p-3 dark:bg-gray-700">
          <div class="text-sm text-gray-800 dark:text-gray-300">Points</div>
          <div class="text-xl font-bold text-black dark:text-white">0</div>
        </div>
      </div>

      <div class="mb-6">
        <div class="flex flex-col items-center rounded-lg bg-gray-200 p-3 dark:bg-gray-700">
          <div class="text-sm text-gray-800 dark:text-gray-300">Exercises-Completed</div>
          <div class="text-xl font-bold text-black dark:text-white">0</div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="mt-auto space-y-3">
        <button
          @click="handleDashboardClick"
          class="block w-full rounded-lg bg-emerald-600 px-4 py-2 text-center text-white transition duration-150 ease-in-out hover:bg-emerald-700"
        >
          Dashboard
        </button>

        <button
          @click="handleGlossaryClick"
          class="block w-full rounded-lg bg-purple-600 px-4 py-2 text-center text-white transition duration-150 ease-in-out hover:bg-purple-700"
        >
          Glossary
        </button>

        <button
          @click="handleLeaderboardClick"
          class="block w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-white transition duration-150 ease-in-out hover:bg-blue-700"
        >
          Leaderboard
        </button>

        <button
          @click="handleLogout"
          class="w-full rounded-lg bg-red-600 px-4 py-2 text-white transition duration-150 ease-in-out hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>
    </aside>
  </div>
</template>
