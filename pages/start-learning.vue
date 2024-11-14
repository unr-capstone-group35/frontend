<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-green-50 flex flex-col overflow-auto">

    <main class="container mx-auto px-4 py-24">
      <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-12">
        Choose a Topic to Start Learning
      </h1>

      <div class="flex flex-col gap-8">
        
        <div class="bg-white p-10 rounded-lg shadow-md w-full max-w-2xl mx-auto">
          <h2 class="text-3xl font-semibold text-gray-800 mb-4">Basics of Computer Science</h2>
          <p class="text-gray-600 mb-6 text-lg">
            Start with foundational concepts like variables, data types, and control structures.
          </p>
          <NuxtLink
            :to="{ name: 'learn', params: { topic: 'basics' } }"
            class="block text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors text-lg"
          >
            Explore
          </NuxtLink>
        </div>

        <div class="bg-white p-10 rounded-lg shadow-md w-full max-w-2xl mx-auto">
          <h2 class="text-3xl font-semibold text-gray-800 mb-4">Data Structures</h2>
          <p class="text-gray-600 mb-6 text-lg">
            Learn about various data structures like arrays, linked lists, stacks, and queues.
          </p>
          <NuxtLink
            :to="{ name: 'learn', params: { topic: 'data-structures' } }"
            class="block text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors text-lg"
          >
            Explore
          </NuxtLink>
        </div>

        <div class="bg-white p-10 rounded-lg shadow-md w-full max-w-2xl mx-auto">
          <h2 class="text-3xl font-semibold text-gray-800 mb-4">Algorithms</h2>
          <p class="text-gray-600 mb-6 text-lg">
            Understand algorithm concepts like sorting, searching, and complexity analysis.
          </p>
          <NuxtLink
            :to="{ name: 'learn', params: { topic: 'algorithms' } }"
            class="block text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors text-lg"
          >
            Explore
          </NuxtLink>
        </div>

      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'StartLearning',
};
</script>

<style scoped>
/* Additional styling here if needed */
</style>
