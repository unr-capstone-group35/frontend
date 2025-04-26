<!-- reset-password.vue -->
<script setup lang="ts">
interface TokenVerifyResponse {
  email: string;
  token: string;
}

const route = useRoute();
const token = computed(() => route.params.token as string);

const newPassword = ref("");
const confirmPassword = ref("");
const passwordError = ref("");
const confirmError = ref("");
const isLoading = ref(false);
const resetSuccess = ref(false);
const resetError = ref("");
const tokenValid = ref(false);
const tokenChecked = ref(false);
const userEmail = ref("");

// Validate the token on page load
onMounted(async () => {
  if (!token.value) {
    resetError.value = "Invalid reset token";
    tokenChecked.value = true;
    return;
  }

  try {
    isLoading.value = true;
    const response = await $fetch<TokenVerifyResponse>(
      `http://localhost:8080/api/reset-password/verify/${token.value}`,
      {
        method: "GET",
      },
    );

    tokenValid.value = true;
    userEmail.value = response.email;
  } catch (error) {
    console.error("Invalid token:", error);
    resetError.value = "This password reset link is invalid or has expired.";
  } finally {
    isLoading.value = false;
    tokenChecked.value = true;
  }
});

function validatePassword() {
  if (newPassword.value.length < 8) {
    passwordError.value = "Password must be at least 8 characters long";
  } else {
    passwordError.value = "";
  }
}

function validateConfirmPassword() {
  if (confirmPassword.value !== newPassword.value) {
    confirmError.value = "Passwords do not match";
  } else {
    confirmError.value = "";
  }
}

const isValid = computed(() => {
  return newPassword.value && confirmPassword.value && !passwordError.value && !confirmError.value;
});

async function handleResetPassword() {
  if (!isValid.value) return;

  try {
    isLoading.value = true;

    await $fetch("http://localhost:8080/api/reset-password/reset", {
      method: "POST",
      body: {
        token: token.value,
        newPassword: newPassword.value,
      },
    });

    resetSuccess.value = true;
  } catch (error) {
    console.error("Password reset failed:", error);
    resetError.value = "Failed to reset password. Please try again or request a new reset link.";
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="page-container flex flex-col">
    <div class="flex w-full flex-1 items-center justify-center">
      <div class="card w-full max-w-md p-6">
        <h2 class="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Reset Your Password</h2>

        <div v-if="!tokenChecked" class="mb-4 rounded bg-gray-100 p-4 text-gray-700">
          <p>Verifying your reset link...</p>
        </div>

        <div v-else-if="resetError" class="mb-4 rounded bg-red-100 p-4 text-red-700">
          <p>{{ resetError }}</p>
          <p class="mt-4">
            <NuxtLink to="/forgot-password" class="font-medium text-emerald-600 hover:underline dark:text-emerald-400">
              Request a new password reset
            </NuxtLink>
          </p>
        </div>

        <div v-else-if="resetSuccess" class="mb-4 rounded bg-green-100 p-4 text-green-700">
          <p>Your password has been reset successfully!</p>
          <p class="mt-4">
            <NuxtLink to="/signin" class="font-medium text-emerald-600 hover:underline dark:text-emerald-400">
              Sign in with your new password
            </NuxtLink>
          </p>
        </div>

        <form v-else-if="tokenValid" @submit.prevent="handleResetPassword">
          <p v-if="userEmail" class="mb-4 text-gray-600 dark:text-gray-300">
            Creating a new password for: <strong>{{ userEmail }}</strong>
          </p>

          <div class="mb-4">
            <label class="mb-2 block font-medium text-gray-700 dark:text-gray-200" for="password">New Password</label>
            <input
              v-model="newPassword"
              type="password"
              id="password"
              class="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Enter new password"
              @input="validatePassword"
              required
            />
            <p v-if="passwordError" class="mt-1 text-xs text-red-500">{{ passwordError }}</p>
          </div>

          <div class="mb-6">
            <label class="mb-2 block font-medium text-gray-700 dark:text-gray-200" for="confirm-password"
              >Confirm Password</label
            >
            <input
              v-model="confirmPassword"
              type="password"
              id="confirm-password"
              class="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Confirm new password"
              @input="validateConfirmPassword"
              required
            />
            <p v-if="confirmError" class="mt-1 text-xs text-red-500">{{ confirmError }}</p>
          </div>

          <button
            type="submit"
            :disabled="!isValid || isLoading"
            class="w-full rounded-lg bg-emerald-600 px-6 py-3 font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-600"
          >
            {{ isLoading ? "Resetting..." : "Reset Password" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
