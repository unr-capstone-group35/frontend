<script setup lang="ts">
import { useProfilePicStore } from "~/stores/profilePicStore"
import { usePointsStore } from "~/stores/pointsStore"

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(["close"])
const router = useRouter()
const authStore = useAuthStore()
const profilePicStore = useProfilePicStore()
const pointsStore = usePointsStore()

// Stats data
const totalPoints = ref(0)
const exercisesCompleted = ref(0)
const currentStreak = ref(0)
// Add new stats matching dashboard
const dailyStreak = ref(0)
const accuracyRate = ref(0)
const totalAttempts = ref(0)
const correctAttempts = ref(0)

// Load profile pic data and user stats
onMounted(async () => {
  await profilePicStore.fetchUserProfilePic()
  await fetchUserStats()
})

// Watch for changes in isOpen to refresh stats when sidebar opens
watch(
  () => props.isOpen,
  async isOpen => {
    if (isOpen) {
      await fetchUserStats()
    }
  }
)

// Watch for changes in points summary
watch(
  () => pointsStore.summary,
  () => {
    if (pointsStore.summary) {
      totalPoints.value = pointsStore.totalPoints
      currentStreak.value = pointsStore.currentStreak

      // Count completed exercises from transactions
      const completedExercises = pointsStore.recentTransactions.filter(
        tx => tx.transactionType === "correct_answer"
      ).length

      exercisesCompleted.value = completedExercises
    }
  },
  { deep: true }
)

// Watch for changes in daily streak data
watch(
  () => pointsStore.dailyStreak,
  () => {
    if (pointsStore.dailyStreak) {
      dailyStreak.value = pointsStore.currentDailyStreak
    }
  },
  { deep: true }
)

// Watch for changes in accuracy data
watch(
  () => pointsStore.accuracyStats,
  () => {
    if (pointsStore.accuracyStats) {
      accuracyRate.value = pointsStore.accuracyRate
      totalAttempts.value = pointsStore.totalAttempts
      correctAttempts.value = pointsStore.correctAttempts
    }
  },
  { deep: true }
)

// Fetch user stats
const fetchUserStats = async () => {
  try {
    await Promise.all([
      pointsStore.fetchPointsSummary(100),
      pointsStore.fetchDailyStreak(),
      pointsStore.fetchAccuracyStats()
    ])

    if (pointsStore.summary) {
      totalPoints.value = pointsStore.totalPoints
      currentStreak.value = pointsStore.currentStreak

      // Count completed exercises from transactions
      const completedExercises = pointsStore.recentTransactions.filter(
        tx => tx.transactionType === "correct_answer"
      ).length

      exercisesCompleted.value = completedExercises
    }

    if (pointsStore.dailyStreak) {
      dailyStreak.value = pointsStore.currentDailyStreak
    }

    if (pointsStore.accuracyStats) {
      accuracyRate.value = pointsStore.accuracyRate
      totalAttempts.value = pointsStore.totalAttempts
      correctAttempts.value = pointsStore.correctAttempts
    }
  } catch (error) {
    console.error("Failed to fetch user stats:", error)
  }
}

// Formatted accuracy rate as percentage without decimal points
const formattedAccuracy = computed(() => {
  return Math.round(accuracyRate.value) + "%"
})

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
      <div class="mb-6 flex flex-col items-center space-y-4">
        <!-- Use normal sized ProfilePic component -->
        <ProfilePic />

        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-300">
          {{ authStore.username || "Unknown" }}
        </h2>
      </div>

      <!-- Stats -->
      <div class="mb-4 grid grid-cols-2 gap-3">
        <!-- Daily Streak Card -->
        <div class="flex flex-col items-center rounded-lg bg-gray-200 p-3 dark:bg-gray-700">
          <div class="text-sm text-gray-800 dark:text-gray-300">Daily Streak</div>
          <div class="text-xl font-bold text-black dark:text-white">{{ dailyStreak }}</div>
        </div>

        <!-- Exercise Streak Card (moved to top right) -->
        <div class="flex flex-col items-center rounded-lg bg-gray-200 p-3 dark:bg-gray-700">
          <div class="text-sm text-gray-800 dark:text-gray-300">Streak</div>
          <div class="text-xl font-bold text-black dark:text-white">{{ currentStreak }}</div>
        </div>
      </div>

      <!-- Second row -->
      <div class="mb-4 grid grid-cols-2 gap-3">
        <!-- Exercises Completed Card with text on new lines -->
        <div class="flex flex-col items-center rounded-lg bg-gray-200 p-3 dark:bg-gray-700">
          <div class="text-sm text-gray-800 dark:text-gray-300">Exercises</div>
          <div class="text-xl font-bold text-black dark:text-white">{{ exercisesCompleted }}</div>
        </div>

        <!-- Accuracy Card with text on new lines -->
        <div class="flex flex-col items-center rounded-lg bg-gray-200 p-3 dark:bg-gray-700">
          <div class="text-sm text-gray-800 dark:text-gray-300">Accuracy</div>
          <div class="text-xl font-bold text-black dark:text-white">{{ formattedAccuracy }}</div>
        </div>
      </div>

      <!-- Points Card as full width -->
      <div class="mb-6">
        <div class="flex flex-col items-center rounded-lg bg-gray-200 p-3 dark:bg-gray-700">
          <div class="text-sm text-gray-800 dark:text-gray-300">Points</div>
          <div class="text-xl font-bold text-black dark:text-white">{{ totalPoints }}</div>
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
