<script setup lang="ts">
const email = ref("");
const isLoading = ref(false);
const requestSent = ref(false);
const authStore = useAuthStore();
const errorMessage = ref("");

const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.value);
});

async function handleResetRequest() {
  if (!isValidEmail.value) return;

  try {
    isLoading.value = true;
    await authStore.requestPasswordReset(email.value);
    requestSent.value = true;
    errorMessage.value = "";
  } catch (error: any) {
    console.error("Password reset request failed:", error);
    errorMessage.value = authStore.error || "Failed to send reset request";
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="page-container flex flex-col">
    <div class="flex w-full flex-1 items-center justify-center">
      <div class="card w-full max-w-md p-6">
        <h2 class="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Forgot Password</h2>

        <div v-if="requestSent" class="mb-4 rounded bg-green-100 p-4 text-green-700">
          <p>If an account exists with this email, we've sent you instructions to reset your password.</p>
          <p class="mt-4">Please check your email and follow the instructions.</p>
          <div class="mt-6 text-center">
            <NuxtLink to="/signin" class="font-medium text-emerald-600 hover:underline dark:text-emerald-400">
              Return to Sign In
            </NuxtLink>
          </div>
        </div>

        <div v-else>
          <div v-if="errorMessage" class="mb-4 rounded bg-red-100 p-3 text-red-700">
            {{ errorMessage }}
          </div>

          <p class="mb-6 text-gray-600 dark:text-gray-300">
            Enter your email address and we'll send you instructions to reset your password.
          </p>

          <form @submit.prevent="handleResetRequest">
            <div class="mb-6">
              <label class="mb-2 block font-medium text-gray-700 dark:text-gray-200" for="email">Email Address</label>
              <input
                v-model="email"
                type="email"
                id="email"
                class="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your email address"
                required
              />
            </div>

            <button
              type="submit"
              :disabled="!isValidEmail || isLoading"
              class="w-full rounded-lg bg-emerald-600 px-6 py-3 font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              {{ isLoading ? "Sending..." : "Send Reset Instructions" }}
            </button>
          </form>

          <p class="mt-4 text-center text-gray-600 dark:text-gray-300">
            Remember your password?
            <NuxtLink to="/signin" class="font-medium text-emerald-600 hover:underline dark:text-emerald-400">
              Sign in
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
