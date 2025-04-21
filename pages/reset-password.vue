<script setup lang="ts">
const email = ref("")
const isLoading = ref(false)
const emailSent = ref(false)
const emailError = ref("")

function validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (email.value && !emailRegex.test(email.value)) {
    emailError.value = "Please enter a valid email address"
  } else {
    emailError.value = ""
  }
}

const isValid = computed(() => {
  return email.value && !emailError.value
})

async function handleResetPassword() {
  if (!isValid.value) return

  try {
    isLoading.value = true
    // TODO: Implement actual reset password API call once backend is ready

    // Simulate a successful request for now
    await new Promise(resolve => setTimeout(resolve, 1000))
    emailSent.value = true
  } catch (error) {
    console.error("Reset password request failed:", error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="page-container flex flex-col">
    <div class="flex w-full flex-1 items-center justify-center">
      <div class="card w-full max-w-md p-6">
        <h2 class="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Reset Password</h2>

        <div v-if="emailSent" class="mb-4 rounded bg-green-100 p-4 text-green-700">
          <p>Password reset email sent! Please check your inbox for further instructions.</p>
          <p class="mt-4">
            <NuxtLink to="/signin" class="font-medium text-emerald-600 hover:underline dark:text-emerald-400">
              Return to Sign In
            </NuxtLink>
          </p>
        </div>

        <form v-else @submit.prevent="handleResetPassword">
          <p class="mb-4 text-gray-600 dark:text-gray-300">
            Enter your account email address and we'll send you instructions to reset your password.
          </p>

          <div class="mb-6">
            <label class="mb-2 block font-medium text-gray-700 dark:text-gray-200" for="email">Email</label>
            <input
              v-model="email"
              type="email"
              id="email"
              class="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="Enter your email"
              @input="validateEmail"
              required
            />
            <p v-if="emailError" class="mt-1 text-xs text-red-500">{{ emailError }}</p>
          </div>

          <button
            type="submit"
            :disabled="!isValid || isLoading"
            class="w-full rounded-lg bg-emerald-600 px-6 py-3 font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-600"
          >
            {{ isLoading ? "Sending..." : "Reset Password" }}
          </button>

          <p class="mt-4 text-center text-gray-600 dark:text-gray-300">
            <NuxtLink to="/signin" class="font-medium text-emerald-600 hover:underline dark:text-emerald-400">
              Back to Sign In
            </NuxtLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
