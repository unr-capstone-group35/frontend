<template>
  <header class="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 w-full">
    <nav class="container mx-auto px-4 py-3 flex justify-between items-center">
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
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'

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
</script>

<style scoped>
/* Additional styles */
</style>
