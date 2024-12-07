<template>
  <div>
    <!-- Background -->
    <div 
      v-if="isOpen"
      @click="close"
      class="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40"
    ></div>

    <!-- Sidebar -->
    <aside 
      class="fixed right-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-md text-white p-4 flex flex-col overflow-y-auto transform transition-transform duration-300 ease-in-out z-50"
      :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <!-- close button -->
      <button 
          @click="close"
          class="absolute top-2 left-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close menu"
      >
          <img 
              src="~/assets/icons/close-x.svg" 
              alt="Close"
              class="w-6 h-6 dark:invert"
          />
      </button>

      <!-- Profile -->
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
        
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-300">
          {{ authStore.user?.username || 'User' }}
        </h2>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 flex flex-col items-center">
          <div class="text-sm text-gray-800 dark:text-gray-300">Streak</div>
          <div class="text-xl font-bold text-black dark:text-white">0</div>
        </div>

        <div class="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 flex flex-col items-center">
          <div class="text-sm text-gray-800 dark:text-gray-300">Points</div>
          <div class="text-xl font-bold text-black dark:text-white">0</div>
        </div>
      </div>

      <div class="mb-6">
        <div class="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 flex flex-col items-center">
          <div class="text-sm text-gray-800 dark:text-gray-300">Exercises-Completed</div>
          <div class="text-xl font-bold text-black dark:text-white">0</div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="mt-auto space-y-3">
          <button 
              @click="handleLeaderboardClick"
              class="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-150 ease-in-out text-center">
              Leaderboard
          </button>

          <button 
              @click="handleLogout"
              class="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition duration-150 ease-in-out">
              Sign Out
          </button>
       </div>
    </aside>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/authStore'

const props = defineProps({
isOpen: {
  type: Boolean,
  required: true
}
})

const emit = defineEmits(['close'])
const router = useRouter()
const authStore = useAuthStore()

const close = () => {
emit('close')
}

const handleLogout = async () => {
try {
  await authStore.logout()
  close()
  router.push('/signin')
} catch (error) {
  console.error('Logout failed:', error)
}
}

const handleLeaderboardClick = () => {
close()
router.push('/leaderboard')
}
</script>