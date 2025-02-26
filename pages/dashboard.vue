<script setup lang="ts">
definePageMeta({
  middleware: ["auth"]
})

const username = useAuthStore().username
</script>

<template>
  <div class="min-h-screen">
    <div class="mx-auto max-w-6xl px-4 py-12">
      <!-- Welcome Section with Profile Picture -->
      <div class="mb-12 text-center">
        <!-- Profile Picture -->
        <div class="mb-6 flex justify-center">
          <div
            class="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-emerald-200 bg-gray-200 dark:border-emerald-800 dark:bg-gray-700"
          >
            <svg class="h-20 w-20 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        <h1 class="mb-4 text-4xl font-bold text-gray-900 dark:text-white">Welcome back, {{ username }}!</h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">Track your progress and continue your learning journey</p>
      </div>

      <!-- Stats Grid -->
      <div class="mx-auto max-w-4xl">
        <div class="relative">
          <!-- Background card with rotation -->
          <div class="accent-gradient absolute inset-0 -rotate-3 transform rounded-2xl"></div>
          <!-- Main content card -->
          <div class="card relative p-8">
            <!-- Stats Grid -->
            <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <!-- Streak Card -->
              <div
                class="transform rounded-xl bg-gray-50 p-6 text-center transition-transform hover:scale-105 dark:bg-gray-700"
              >
                <div class="text-primary mb-2 text-xl">Daily Streak</div>
                <div class="text-4xl font-bold text-gray-900 dark:text-white">0</div>
                <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">days</div>
              </div>

              <!-- Points Card -->
              <div
                class="transform rounded-xl bg-gray-50 p-6 text-center transition-transform hover:scale-105 dark:bg-gray-700"
              >
                <div class="text-primary mb-2 text-xl">Total Points</div>
                <div class="text-4xl font-bold text-gray-900 dark:text-white">0</div>
                <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">points earned</div>
              </div>

              <!-- Exercises Card -->
              <div
                class="transform rounded-xl bg-gray-50 p-6 text-center transition-transform hover:scale-105 dark:bg-gray-700"
              >
                <div class="text-primary mb-2 text-xl">Exercises</div>
                <div class="text-4xl font-bold text-gray-900 dark:text-white">0</div>
                <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">completed</div>
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
    </div>
  </div>
</template>
