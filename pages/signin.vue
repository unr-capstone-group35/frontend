<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">


    <!-- Sign-in Form Container -->
    <div class="flex-1 flex items-center justify-center w-full">
      <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Sign In</h2>
        
        <form @submit.prevent="handleSignIn">
          <div class="mb-4">
            <label class="block text-gray-700 font-medium mb-2" for="email">Email</label>
            <input
              v-model="email"
              type="email"
              id="email"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              placeholder="Enter your email"
              required
            />
          </div>

          <div class="mb-6">
            <label class="block text-gray-700 font-medium mb-2" for="password">Password</label>
            <input
              v-model="password"
              type="password"
              id="password"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </form>

        <p class="mt-4 text-center text-gray-600">
          Don't have an account?
          <NuxtLink to="/signup" class="text-emerald-600 font-medium hover:underline">
            Sign up
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';

export default {
  components: {
    Header
  },
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    handleSignIn() {
      // Implement sign-in logic here
      alert(`Signing in with ${this.email}`);
    }
  }
};
</script>

<style scoped>
/* Add any additional styling here if needed */
</style>
