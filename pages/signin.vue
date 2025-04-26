<script setup lang="ts">
const username = ref("");
const password = ref("");
const showPassword = ref(false);
const isLoading = ref(false);
const authStore = useAuthStore();

useHead({
  title: "Signin | DevQuest",
});

async function handleSignIn() {
  try {
    isLoading.value = true;
    await authStore.signin(username.value, password.value);
  } catch (error) {
    console.error("Signin failed:", error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="page-container flex flex-col">
    <div class="flex w-full flex-1 items-center justify-center">
      <div class="card w-full max-w-md p-6">
        <h2 class="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Sign In</h2>

        <!-- Show error message if exists -->
        <div v-if="authStore.error" class="mb-4 rounded bg-red-100 p-3 text-red-700">
          {{ authStore.error }}
        </div>

        <form @submit.prevent="handleSignIn">
          <div class="mb-4">
            <label class="mb-2 block font-medium text-gray-700 dark:text-gray-200" for="username">Username</label>
            <input
              v-model="username"
              type="text"
              id="username"
              class="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="Enter your username"
              required
            />
          </div>

          <div class="mb-6">
            <label class="mb-2 block font-medium text-gray-700 dark:text-gray-200" for="password">Password</label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                id="password"
                class="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg
                  v-if="showPassword"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="h-5 w-5"
                >
                  <path
                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                  />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="h-5 w-5"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
            <div class="mt-1 text-right">
              <NuxtLink to="/forgot-password" class="text-sm text-emerald-600 hover:underline dark:text-emerald-400">
                Forgot your password?
              </NuxtLink>
            </div>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full rounded-lg bg-emerald-600 px-6 py-3 font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-600"
          >
            {{ isLoading ? "Signing in..." : "Sign In" }}
          </button>
        </form>

        <p class="mt-4 text-center text-gray-600 dark:text-gray-300">
          Don't have an account?
          <NuxtLink to="/signup" class="font-medium text-emerald-600 hover:underline dark:text-emerald-400">
            Sign up
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
