<template>
  <footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-4">
    <div class="container mx-auto px-4 flex justify-between items-center">
      <div>
        <p class="text-gray-600 dark:text-gray-400 text-sm">© 2024 DevQuest. All rights reserved.</p>
      </div>
      <div class="flex space-x-4">
        <NuxtLink 
          to="/privacy" 
          class="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          Privacy Policy
        </NuxtLink>
        <NuxtLink 
          to="/terms" 
          class="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          Terms of Service
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
};
</script>