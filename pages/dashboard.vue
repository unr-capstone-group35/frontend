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

// Fetch points data on component mount
onMounted(async () => {
  await pointsStore.fetchPointsSummary()
})

// Handle edit profile pic button click
const handleProfilePicEdit = () => {
  showProfilePicSelector.value = true
}

// Calculate completed exercises from transactions
const completedExercises = computed(() => {
  return pointsStore.recentTransactions.filter(transaction => transaction.transactionType === "correct_answer").length
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
        <p class="text-lg text-gray-600 dark:text-gray-300">Track your progress and continue your learning journey</p>
      </div>

      <!-- Stats Grid -->
      <div class="mx-auto max-w-4xl">
        <div class="relative">
          <div class="background-card"></div>
          <div class="card relative p-8">
            <!-- Stats Grid -->
            <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <!-- Streak Card -->
              <div
                class="transform rounded-xl bg-gray-50 p-6 text-center transition-transform hover:scale-105 dark:bg-gray-600"
              >
                <div class="text-primary mb-2 text-xl">Daily Streak</div>
                <div class="text-4xl font-bold text-gray-900 dark:text-white">0</div>
                <div class="mt-1 text-sm text-gray-500 dark:text-gray-200">days</div>
              </div>

              <!-- Points Card -->
              <div
                class="transform rounded-xl bg-gray-50 p-6 text-center transition-transform hover:scale-105 dark:bg-gray-600"
              >
                <div class="text-primary mb-2 text-xl">Total Points</div>
                <div class="text-4xl font-bold text-gray-900 dark:text-white">{{ pointsStore.totalPoints }}</div>
                <div class="mt-1 text-sm text-gray-500 dark:text-gray-200">points earned</div>
              </div>

              <!-- Exercises Card -->
              <div
                class="transform rounded-xl bg-gray-50 p-6 text-center transition-transform hover:scale-105 dark:bg-gray-600"
              >
                <div class="text-primary mb-2 text-xl">Exercises</div>
                <div class="text-4xl font-bold text-gray-900 dark:text-white">{{ completedExercises }}</div>
                <div class="mt-1 text-sm text-gray-500 dark:text-gray-200">completed</div>
              </div>
            </div>

            <!-- Start Learning Button -->
            <div class="mt-8 text-center">
              <NuxtLink
                to="/start-learning"
                class="bg-primary hover-primary inline-block transform rounded-xl px-8 py-4 font-bold text-white shadow-md transition-all hover:scale-105"
              >
                Continue Learning
              </NuxtLink>
            </div>

            <!-- Quick Links -->
            <div class="mt-8 flex justify-center gap-4">
              <NuxtLink to="/leaderboard" class="text-primary font-medium"> View Leaderboard </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer with Reset Password Link -->
      <div class="mt-16 text-center">
        <!-- Green version (default) -->

        <NuxtLink
          to="/reset-password"
          class="text-sm font-medium text-gray-400 transition-colors hover:text-gray-300 dark:text-gray-500 dark:hover:text-gray-400"
        >
          Reset Your Password
        </NuxtLink>

        <!-- green link version -->
        <!-- 
        <NuxtLink to="/reset-password" class="text-primary text-sm font-medium transition-colors hover:underline">
          Reset Your Password
        </NuxtLink>
        -->
      </div>
    </div>

    <!-- Profile Picture Selector Dialog -->
    <ProfilePicSelector v-model="showProfilePicSelector" />
  </div>
</template>
