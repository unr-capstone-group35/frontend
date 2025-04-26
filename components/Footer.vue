<script lang="ts">
export default {
  name: "Footer",
};
</script>

<template>
  <footer class="border-t border-gray-200 bg-white py-4 dark:border-gray-700 dark:bg-gray-900">
    <div class="container mx-auto flex items-center justify-between px-4">
      <div>
        <p class="text-sm text-gray-600 dark:text-gray-400">© 2024 DevQuest. All rights reserved.</p>
      </div>
      <div class="flex space-x-4">
        <NuxtLink
          to="/privacy"
          class="text-gray-600 transition-colors hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
        >
          Privacy Policy
        </NuxtLink>
        <NuxtLink
          to="/terms"
          class="text-gray-600 transition-colors hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
        >
          Terms of Service
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>
