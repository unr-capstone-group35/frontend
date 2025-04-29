<script setup lang="ts">
const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

const toggleTheme = () => {
  colorMode.preference = isDark.value ? "light" : "dark";
};

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<template>
  <div>
    <header class="w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <nav class="flex items-center justify-between px-12 py-3">
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="text-xl font-bold text-emerald-600 dark:text-emerald-400">DevQuest</span>
        </NuxtLink>
        <div class="flex items-center gap-4">
          <button
            @click="toggleTheme"
            class="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Toggle theme"
          >
            <img v-if="isDark" src="~/assets/icons/sun.svg" alt="Light mode" class="h-5 w-5" />
            <img v-else src="~/assets/icons/moon.svg" alt="Dark mode" class="h-5 w-5" />
          </button>

          <!-- Hamburger Menu Button -->
          <button
            v-if="useAuthStore().isLoggedIn"
            @click="toggleMenu"
            class="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Toggle menu"
          >
            <img src="~/assets/icons/hamburger-menu.svg" alt="Menu" class="h-6 w-6 dark:invert" />
          </button>
        </div>
      </nav>
    </header>

    <UserSidebar v-if="useAuthStore().isLoggedIn" :is-open="isMenuOpen" @close="toggleMenu" />
  </div>
</template>

<style scoped>
/* Additional styles */
</style>
