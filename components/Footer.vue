<template>
  <footer class="bg-white border-t border-gray-200 py-4">
    <div class="container mx-auto px-4 flex justify-between items-center">
      <div>
        <p class="text-gray-600 text-sm">© 2024 CodeLingo. All rights reserved.</p>
      </div>
      <div class="flex space-x-4">
        <NuxtLink to="/privacy" class="text-gray-600 hover:text-emerald-600">Privacy Policy</NuxtLink>
        <NuxtLink to="/terms" class="text-gray-600 hover:text-emerald-600">Terms of Service</NuxtLink>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
};
</script>

<style scoped>
/* additional styles */
</style>
