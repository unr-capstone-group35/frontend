<script setup lang="ts">
definePageMeta({
  middleware: ["auth"]
})

const username = useAuthStore().username
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-b from-white to-green-50 dark:from-gray-900 dark:to-gray-800"
  >
    <div class="mx-auto max-w-6xl px-4 py-12">
      <!-- Welcome Section with Profile Picture -->
      <div class="mb-12 text-center">
        <!-- Profile Picture -->
        <div class="mb-6 flex justify-center">
          <div
            class="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-emerald-200 bg-gray-200 dark:border-emerald-800 dark:bg-gray-700"
          >
            <svg
              class="h-20 w-20 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
        <h1 class="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
          Welcome back, {{ username }}
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Track your progress and continue your learning journey
        </p>
      </div>

      <!-- Stats Grid -->
      <div class="mx-auto max-w-4xl">
        <div class="relative">
          <!-- Background card with rotation -->
          <div
            class="absolute inset-0 -rotate-3 transform rounded-2xl bg-gradient-to-br from-green-200 to-green-100 dark:from-green-800 dark:to-green-900"
          ></div>

          <!-- Main content card -->
          <div
            class="relative rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800"
          >
            <!-- Stats Grid -->
            <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <!-- Streak Card -->
              <div
                class="transform rounded-xl bg-gray-50 p-6 text-center transition-transform hover:scale-105 dark:bg-gray-700"
              >
                <div
                  class="mb-2 text-xl text-emerald-600 dark:text-emerald-400"
                >
                  Daily Streak
                </div>
                <div class="text-4xl font-bold text-gray-900 dark:text-white">
                  0
                </div>
                <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  days
                </div>
              </div>

              <!-- Points Card -->
              <div
                class="transform rounded-xl bg-gray-50 p-6 text-center transition-transform hover:scale-105 dark:bg-gray-700"
              >
                <div
                  class="mb-2 text-xl text-emerald-600 dark:text-emerald-400"
                >
                  Total Points
                </div>
                <div class="text-4xl font-bold text-gray-900 dark:text-white">
                  0
                </div>
                <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  points earned
                </div>
              </div>

              <!-- Exercises Card -->
              <div
                class="transform rounded-xl bg-gray-50 p-6 text-center transition-transform hover:scale-105 dark:bg-gray-700"
              >
                <div
                  class="mb-2 text-xl text-emerald-600 dark:text-emerald-400"
                >
                  Exercises
                </div>
                <div class="text-4xl font-bold text-gray-900 dark:text-white">
                  0
                </div>
                <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  completed
                </div>
              </div>
            </div>

            <!-- Start Learning Button -->
            <div class="mt-8 text-center">
              <NuxtLink
                to="/start-learning"
                class="inline-block transform rounded-xl bg-emerald-600 px-8 py-4 font-bold text-white shadow-md transition-all hover:scale-105 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
              >
                Continue Learning
              </NuxtLink>
            </div>

            <!-- Quick Links -->
            <div class="mt-8 flex justify-center gap-4">
              <NuxtLink
                to="/leaderboard"
                class="font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-500"
              >
                View Leaderboard
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"]
})

const username = useAuthStore().username
</script>
