<script setup lang="ts">
definePageMeta({
  middleware: ["auth"]
})

const username = useAuthStore().username
const showProfilePicSelector = ref(false)

// Initialize profile picture store
const profilePicStore = useProfilePicStore()
// Initialize points store
const pointsStore = usePointsStore()

const totalPoints = ref(0)
const currentStreak = ref(0)
const dailyStreak = ref(0)
const accuracyRate = ref(0)
const totalAttempts = ref(0)
const correctAttempts = ref(0)
const exercisesCompleted = ref(0)

// Show loading indicators
const isLoading = ref(true)

// Watch for changes in the points summary data
watch(
  () => pointsStore.summary,
  () => {
    if (pointsStore.summary) {
      totalPoints.value = pointsStore.totalPoints
      currentStreak.value = pointsStore.currentStreak

      const completed = pointsStore.recentTransactions.filter(tx => tx.transactionType === "correct_answer").length
      exercisesCompleted.value = completed
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

// Fetch points data on component mount
onMounted(async () => {
  try {
    await Promise.all([
      pointsStore.fetchPointsSummary(100),
      pointsStore.fetchDailyStreak(),
      pointsStore.fetchAccuracyStats()
    ])
  } catch (error) {
    console.error("Error loading stats:", error)
  } finally {
    isLoading.value = false
  }
})

// Handle edit profile pic button click
const handleProfilePicEdit = () => {
  showProfilePicSelector.value = true
}

// Format accuracy rate as percentage without decimal points
const formattedAccuracy = computed(() => {
  return Math.round(accuracyRate.value) + "%"
})
</script>

<template>
  <div class="page-container">
    <div class="mx-auto max-w-6xl px-4 py-12">
      <!-- Welcome Section with Profile Picture -->
      <div class="mb-12 text-center">
        <!-- Profile Picture -->
        <div class="mb-6 flex justify-center">
          <ProfilePic :editable="true" @editClick="handleProfilePicEdit" />
        </div>
        <h1 class="mb-4 text-4xl font-bold text-gray-900 dark:text-white">Welcome back, {{ username }}!</h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Track your progress and continue your learning journey 🚀
        </p>
      </div>

      <!-- Stats Dashboard -->
      <div class="mx-auto max-w-3xl">
        <div class="relative">
          <div class="background-card"></div>
          <div class="card relative p-8 py-10">
            <!-- Stats Grid - Loading State -->
            <div v-if="isLoading" class="flex h-48 items-center justify-center">
              <div class="text-center">
                <div
                  class="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-4 border-t-4 border-gray-300 border-t-blue-600"
                ></div>
                <p class="text-gray-600 dark:text-gray-300">Loading your stats...</p>
              </div>
            </div>

            <div v-else class="grid grid-cols-1 gap-8">
              <!-- First row: 3 stats cards -->
              <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <!-- Daily Streak Card -->
                <div
                  class="mx-3 flex transform flex-col rounded-xl bg-white p-4 text-center transition-transform hover:scale-105 dark:bg-gray-600"
                >
                  <div class="dark:text-primary mb-1 text-lg text-gray-700">Daily Streak</div>
                  <div class="text-4xl font-medium text-gray-800 dark:text-white">
                    {{ dailyStreak }}
                  </div>
                </div>

                <!-- Points Card -->
                <div
                  class="mx-3 flex transform flex-col rounded-xl bg-white p-4 text-center transition-transform hover:scale-105 dark:bg-gray-600"
                >
                  <div class="dark:text-primary mb-1 text-lg text-gray-700">Points</div>
                  <div class="text-4xl font-medium text-gray-800 dark:text-white">
                    {{ totalPoints }}
                  </div>
                </div>

                <!-- Exercise Streak Card -->
                <div
                  class="mx-3 flex transform flex-col rounded-xl bg-white p-4 text-center transition-transform hover:scale-105 dark:bg-gray-600"
                >
                  <div class="dark:text-primary mb-1 text-lg text-gray-700">Streak</div>
                  <div class="text-4xl font-medium text-gray-800 dark:text-white">
                    {{ currentStreak }}
                  </div>
                </div>
              </div>

              <!-- Second row: buttons in middle, stats on sides -->
              <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <!-- Exercises Completed Card -->
                <div
                  class="mx-3 flex transform flex-col rounded-xl bg-white p-4 text-center transition-transform hover:scale-105 dark:bg-gray-600"
                >
                  <div class="dark:text-primary mb-1 text-lg text-gray-700">Exercises</div>
                  <div class="text-4xl font-medium text-gray-800 dark:text-white">
                    {{ exercisesCompleted }}
                  </div>
                  <div class="dark:text-primary text-md text-gray-700">Completed</div>
                </div>

                <!-- Middle section with buttons -->
                <div class="flex flex-col items-center justify-center py-2">
                  <NuxtLink
                    to="/start-learning"
                    class="bg-primary hover-primary mb-5 inline-block w-auto transform rounded-xl px-4 py-3 text-center font-bold text-white shadow-md transition-all hover:scale-105"
                  >
                    Continue Learning
                  </NuxtLink>

                  <NuxtLink to="/leaderboard" class="text-primary text-sm font-medium hover:underline">
                    view leaderboard
                  </NuxtLink>
                </div>

                <!-- Accuracy Card -->
                <div
                  class="mx-3 flex transform flex-col rounded-xl bg-white p-4 text-center transition-transform hover:scale-105 dark:bg-gray-600"
                >
                  <div class="dark:text-primary mb-1 text-lg text-gray-700">Accuracy</div>
                  <div class="text-4xl font-medium text-gray-800 dark:text-white">{{ Math.round(accuracyRate) }}%</div>
                  <div class="text-md dark:text-primary text-gray-700">Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer with Reset Password Link -->
      <div class="mt-12 text-center">
        <NuxtLink
          to="/reset-password"
          class="text-sm font-medium text-gray-400 transition-colors hover:text-gray-300 dark:text-gray-500 dark:hover:text-gray-400"
        >
          Reset Your Password
        </NuxtLink>
      </div>
    </div>

    <!-- Profile Picture Selector Dialog -->
    <ProfilePicSelector v-model="showProfilePicSelector" />
  </div>
</template>
