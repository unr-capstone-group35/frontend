<script setup lang="ts">
const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

const toggleTheme = () => {
  colorMode.preference = isDark.value ? "light" : "dark";
};

const route = useRoute();
const isMenuOpen = ref(false);

// Import the auth store
const authStore = useAuthStore();

const showHamburger = computed(() => {
  const excludedRoutes = ["/signin", "/signup"];

  if (excludedRoutes.includes(route.path)) {
    return false;
  }

  if (route.path === "/") {
    return authStore.isAuthenticated;
  }

  // Show on all other routes
  return true;
});

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
            v-if="showHamburger"
            @click="toggleMenu"
            class="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Toggle menu"
          >
            <img src="~/assets/icons/hamburger-menu.svg" alt="Menu" class="h-6 w-6 dark:invert" />
          </button>
        </div>
      </nav>
    </header>

    <UserSidebar :is-open="isMenuOpen" @close="toggleMenu" />
  </div>
</template>

<style scoped>
/* Additional styles */
</style>
