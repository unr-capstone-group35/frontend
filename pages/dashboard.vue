<!-- pages/dashboard.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-b from-white dark:from-gray-900 to-green-50 dark:to-gray-800">
    <div class="max-w-6xl mx-auto px-4 py-12">
      <!-- Welcome Section with Profile Picture -->
      <div class="text-center mb-12">
        <!-- Profile Picture -->
        <div class="flex justify-center mb-6">
          <div class="w-28 h-28 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-4 border-emerald-200 dark:border-emerald-800">
            <svg 
              class="w-20 h-20 text-gray-400" 
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
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome back, {{ authStore.user?.username }}!
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Track your progress and continue your learning journey
        </p>
      </div>

      <!-- Stats Grid -->
      <div class="max-w-4xl mx-auto">
        <div class="relative">
          <!-- Background card with rotation -->
          <div class="absolute inset-0 bg-gradient-to-br from-green-200 dark:from-green-800 to-green-100 dark:to-green-900 rounded-2xl transform -rotate-3"></div>
          
          <!-- Main content card -->
          <div class="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
            <!-- Stats Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <!-- Streak Card -->
              <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center transform transition-transform hover:scale-105">
                <div class="text-emerald-600 dark:text-emerald-400 text-xl mb-2">Daily Streak</div>
                <div class="text-4xl font-bold text-gray-900 dark:text-white">0</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">days</div>
              </div>

              <!-- Points Card -->
              <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center transform transition-transform hover:scale-105">
                <div class="text-emerald-600 dark:text-emerald-400 text-xl mb-2">Total Points</div>
                <div class="text-4xl font-bold text-gray-900 dark:text-white">0</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">points earned</div>
              </div>

              <!-- Exercises Card -->
              <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center transform transition-transform hover:scale-105">
                <div class="text-emerald-600 dark:text-emerald-400 text-xl mb-2">Exercises</div>
                <div class="text-4xl font-bold text-gray-900 dark:text-white">0</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">completed</div>
              </div>
            </div>

            <!-- Start Learning Button -->
            <div class="text-center mt-8">
              <NuxtLink
                to="/start-learning"
                class="inline-block bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-bold py-4 px-8 rounded-xl shadow-md transition-all transform hover:scale-105"
              >
                Continue Learning
              </NuxtLink>
            </div>

            <!-- Quick Links -->
            <div class="flex justify-center gap-4 mt-8">
              <NuxtLink
                to="/leaderboard"
                class="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-500 font-medium"
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

<script setup>
import { useAuthStore } from '~/stores/authStore'

definePageMeta({
  middleware: ['auth']
})

const authStore = useAuthStore()
</script>