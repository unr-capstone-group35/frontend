<!-- components/Header.vue -->
<template>
  <header class="border-b bg-white w-full">
    <nav class="container mx-auto px-4 py-3 flex justify-between items-center">
      <NuxtLink to="/" class="flex items-center gap-2">
        <span class="font-bold text-xl text-emerald-600">CodeLingo</span>
      </NuxtLink>
      <div class="flex items-center gap-4">
        <button class="text-gray-600 hover:text-gray-800 text-sm font-medium">
          SITE LANGUAGE: ENGLISH
        </button>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: "Header",
};
</script>

<style scoped>
/* Additional styles */
</style>
