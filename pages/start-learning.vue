<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-green-50 flex flex-col">

    <main class="container mx-auto px-4 flex-1 py-24">
      <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-12">
        Choose a Topic to Start Learning
      </h1>

      <div class="flex flex-col lg:flex-row gap-12 justify-center">
        <div class="bg-white p-8 rounded-lg shadow-md max-w-xs mx-auto">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Data Structures</h2>
          <p class="text-gray-600 mb-4">
            Learn about various data structures like arrays, linked lists, stacks, and queues.
          </p>
          <NuxtLink
            to="/data-structures"
            class="block text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Explore
          </NuxtLink>
        </div>

        <div class="bg-white p-8 rounded-lg shadow-md max-w-xs mx-auto">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Algorithms</h2>
          <p class="text-gray-600 mb-4">
            Understand algorithm concepts like sorting, searching, and complexity analysis.
          </p>
          <NuxtLink
            to="/algorithms"
            class="block text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Explore
          </NuxtLink>
        </div>

        <div class="bg-white p-8 rounded-lg shadow-md max-w-xs mx-auto">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Basics of Computer Science</h2>
          <p class="text-gray-600 mb-4">
            Start with foundational concepts like variables, data types, and control structures.
          </p>
          <NuxtLink
            to="/basics"
            class="block text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Explore
          </NuxtLink>
        </div>
      </div>

      <!-- Additional Topics can be added here -->
    </main>
  </div>
</template>

<script>
export default {
  name: 'StartLearning',
};
</script>

<style scoped>
/* Add any additional styling here if needed */
</style>
