<template>
  <div class="flex min-h-screen bg-gray-100 dark:bg-gray-900">
    <div class="w-80 p-6 flex flex-col">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <!-- Current user(left card) -->
        <div class="flex flex-col items-center space-y-4 mb-8">
          <div class="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
            <svg 
              class="w-16 h-16 text-gray-400" 
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
          <h2 class="text-xl font-semibold text-emerald-600 dark:text-emerald-500">Your Points</h2>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 flex flex-col items-center">
            <div class="text-sm text-gray-800 dark:text-gray-300">Streak</div>
            <div class="text-xl font-bold text-black dark:text-white">0</div>
          </div>
          <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 flex flex-col items-center">
            <div class="text-sm text-gray-800 dark:text-gray-300">Points</div>
            <div class="text-xl font-bold text-black dark:text-white">0</div>
          </div>
        </div>

        <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 flex flex-col items-center">
          <div class="text-sm text-gray-800 dark:text-gray-300">Exercises Completed</div>
          <div class="text-xl font-bold text-black dark:text-white">0</div>
        </div>
      </div>

      <!-- Moved Dashboard Link here -->
      <NuxtLink
        to="/dashboard"
        class="mt-6 w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md transition-colors text-center"
      >
        Back to Dashboard
      </NuxtLink>
    </div>

    <!-- Leaderboard(right card)-->
    <div class="flex-1 p-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-6 text-emerald-600 dark:text-emerald-500">Leaderboard</h2>
        
        <div class="space-y-4">
          <div v-for="(user, index) in leaderboardUsers" :key="index"
              :class="[
              'flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg',
              {
                  'border-2 border-yellow-500': index === 0,  
                  'border-2 border-gray-300': index === 1,     
                  'border-2 border-amber-600': index === 2,   
              }
              ]">
            <div class="flex items-center space-x-4">
              <span class="text-lg font-semibold text-gray-700 dark:text-gray-300">{{ index + 1 }}</span>
              <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
              </div>
              <span class="text-gray-800 dark:text-gray-300">{{ user.name }}</span>
            </div>
            <span class="font-semibold text-gray-700 dark:text-gray-300">{{ user.points }} points</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// add functionality once back-end/database complete
const leaderboardUsers = [
  { name: 'You', points: 100 },
  { name: 'User_23', points: 80 },
  { name: 'User_48', points: 50 },
  { name: 'User_12', points: 20 },
  { name: 'User_87', points: 10 }
]
</script>