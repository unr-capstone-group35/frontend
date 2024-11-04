<template>
    <div class="min-h-screen bg-gradient-to-b from-white to-green-50 flex flex-col">
  
      <main class="container mx-auto px-4 flex-1 flex items-center py-24">
        <div class="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-6xl mx-auto">
          <div class="lg:w-1/2 text-center lg:text-left order-2 lg:order-1">
            <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              The free, fun, and effective way to learn programming concepts!
            </h1>
            <p class="text-lg text-gray-600 mb-8">
              Master programming fundamentals through interactive lessons and
              hands-on coding challenges.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto lg:mx-0">
              <NuxtLink
                to="/start-learning"
                class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-xl shadow-md transition-colors flex-1"
              >
                START LEARNING
              </NuxtLink>
              <NuxtLink
                to="/signin"
                class="inline-flex items-center justify-center border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-bold py-4 px-8 rounded-xl transition-colors flex-1"
              >
                SIGN IN
              </NuxtLink>
            </div>
          </div>
  
          <div class="lg:w-1/2 order-1 lg:order-2">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-br from-green-200 to-green-100 rounded-2xl transform -rotate-3"></div>
              <div class="relative bg-white p-8 rounded-2xl shadow-lg">
                <div class="space-y-4">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span class="text-2xl">💻</span>
                    </div>
                    <div class="flex-1">
                      <div class="h-4 bg-gray-100 rounded w-3/4"></div>
                      <div class="h-3 bg-gray-50 rounded w-1/2 mt-2"></div>
                    </div>
                  </div>
                  <div class="space-y-2">
                    <div class="h-3 bg-gray-100 rounded w-full"></div>
                    <div class="h-3 bg-gray-50 rounded w-5/6"></div>
                    <div class="h-3 bg-gray-100 rounded w-4/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
</template>

<script>
export default {
  name: 'IndexPage',
};
</script>

<style scoped>
/* additional styling */
</style>
