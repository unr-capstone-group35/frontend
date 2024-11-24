<template>
  <div>
    <header class="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 w-full">
      <nav class="py-3 flex justify-between items-center px-12">
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="font-bold text-xl text-emerald-600 dark:text-emerald-400">DevQuest</span>
        </NuxtLink>
        <div class="flex items-center gap-4">
          <button
            @click="toggleTheme"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            <img 
              v-if="isDark" 
              src="~/assets/icons/sun.svg" 
              alt="Light mode"
              class="w-5 h-5"
            />
            <img 
              v-else 
              src="~/assets/icons/moon.svg" 
              alt="Dark mode"
              class="w-5 h-5"
            />
          </button>
          
          <!-- Hamburger Menu Button -->
          <button
            v-if="showHamburger"
            @click="toggleMenu"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle menu"
          >
            <img 
              src="~/assets/icons/hamburger-menu.svg" 
              alt="Menu"
              class="w-6 h-6 dark:invert" 
            />
          </button>
        </div>
      </nav>
    </header>

    <UserSidebar 
      :is-open="isMenuOpen"
      @close="toggleMenu"
    />
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.setAttribute('data-theme', 'dark')
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.setAttribute('data-theme', 'light')
    document.documentElement.classList.remove('dark')
  }
  // Save preference to localStorage
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  // Check for saved theme preference or system preference
  const savedTheme = localStorage.getItem('theme')
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  isDark.value = savedTheme === 'dark' || (!savedTheme && systemDark)
  
  if (isDark.value) {
    document.documentElement.setAttribute('data-theme', 'dark')
    document.documentElement.classList.add('dark')
  }
})

const route = useRoute()
const isMenuOpen = ref(false)

// don't show on index.vue and sign in pages
const showHamburger = computed(() => {
  const excludedRoutes = ['/', '/signin', '/signup']
  return !excludedRoutes.includes(route.path)
})

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

</script>

<style scoped>
/* Additional styles */
</style>
