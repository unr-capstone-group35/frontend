<script setup lang="ts">
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const email = ref("")
const username = ref("")
const password = ref("")
const confirmPassword = ref("")
const isLoading = ref(false)
const emailError = ref("")
const passwordMatchError = ref("")
const passwordLengthError = ref("")
const authStore = useAuthStore()

const MIN_PASSWORD_LENGTH = 8

function validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (email.value && !emailRegex.test(email.value)) {
    emailError.value = "Please enter a valid email address"
  } else {
    emailError.value = ""
  }
}

function validatePasswords() {
  // Check password length
  if (password.value && password.value.length < MIN_PASSWORD_LENGTH) {
    passwordLengthError.value = `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
  } else {
    passwordLengthError.value = ""
  }

  // Check if passwords match
  if (confirmPassword.value && password.value !== confirmPassword.value) {
    passwordMatchError.value = "Passwords do not match"
  } else {
    passwordMatchError.value = ""
  }
}

const isValid = computed(() => {
  return (
    email.value &&
    username.value &&
    password.value &&
    confirmPassword.value &&
    password.value === confirmPassword.value &&
    password.value.length >= MIN_PASSWORD_LENGTH &&
    !emailError.value
  )
})

async function handleSignUp() {
  if (!isValid.value) return

  try {
    isLoading.value = true
    await authStore.signup(email.value, username.value, password.value)
  } catch (error) {
    console.error("Signup failed:", error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="page-container flex flex-col">
    <div class="flex w-full flex-1 items-center justify-center">
      <div class="card w-full max-w-md">
        <h2 class="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Sign Up</h2>

        <!-- Show API error message if exists -->
        <div v-if="authStore.error" class="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
          {{ authStore.error }}
        </div>

        <form @submit.prevent="handleSignUp">
          <div class="mb-4">
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

          <div class="mb-4">
            <label class="mb-2 block font-medium text-gray-700 dark:text-gray-200" for="username">Username</label>
            <input
              v-model="username"
              type="text"
              id="username"
              class="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="Choose a username"
              required
            />
          </div>

          <div class="mb-4">
            <label class="mb-2 block font-medium text-gray-700 dark:text-gray-200" for="password">Password</label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                id="password"
                class="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="Create a password"
                @input="validatePasswords"
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
            <p v-if="passwordLengthError" class="mt-1 text-xs text-red-500">{{ passwordLengthError }}</p>
          </div>

          <div class="mb-6">
            <label class="mb-2 block font-medium text-gray-700 dark:text-gray-200" for="confirmPassword"
              >Confirm Password</label
            >
            <div class="relative">
              <input
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                id="confirmPassword"
                class="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="Confirm your password"
                @input="validatePasswords"
                required
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg
                  v-if="showConfirmPassword"
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
            <p v-if="passwordMatchError" class="mt-1 text-xs text-red-500">{{ passwordMatchError }}</p>
          </div>

          <button
            type="submit"
            :disabled="!isValid || isLoading"
            class="w-full rounded-lg bg-emerald-600 px-6 py-3 font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-600"
          >
            {{ isLoading ? "Signing up..." : "Sign Up" }}
          </button>
        </form>

        <p class="mt-4 text-center text-gray-600 dark:text-gray-300">
          Already have an account?
          <NuxtLink to="/signin" class="font-medium text-emerald-600 hover:underline dark:text-emerald-400">
            Sign in
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
