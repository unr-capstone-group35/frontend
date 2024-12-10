<template>
  <div class="min-h-screen bg-gradient-to-b from-white dark:from-gray-900 to-green-50 dark:to-gray-800">
    <main class="max-w-7xl mx-auto p-12 py-24 space-y-24">
      <!-- Computer Science Basics -->
      <section class="flex flex-col lg:flex-row gap-8 pb-12 border-b border-gray-200 dark:border-gray-700">
        <div class="lg:w-2/5">
          <h2 class="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Computer Science Basics</h2>
          <p class="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
            Master the fundamental concepts of computer science and programming. Build a strong foundation in computational thinking and problem-solving skills essential for any programming journey.
          </p>
        </div>
        <div class="lg:w-3/5">
          <CourseCard
            courseId="cs-basics"
            title="Programming Fundamentals"
            description="Learn the basics of programming and computational thinking through hands-on exercises and real-world examples."
            :image="'/images/basics3.jpg'"
            :duration="5"
            difficulty="Easy"
          />
        </div>
      </section>

      <!-- Data Structures -->
      <section class="flex flex-col lg:flex-row gap-8 pb-12 border-b border-gray-200 dark:border-gray-700">
        <div class="lg:w-2/5">
          <h2 class="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Data Structures</h2>
          <p class="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
            Dive deep into essential data structures that power modern software. Learn how to organize and manage data efficiently for optimal performance and scalability.
          </p>
        </div>
        <div class="lg:w-3/5">
          <CourseCard
            courseId="data-structures"
            title="Data Structures"
            description="Master fundamental data structures like arrays, linked lists, and trees with practical implementations."
            :image="'/images/data-structures2.jpg'"
            :duration="10"
            difficulty="Medium"
          />
        </div>
      </section>

      <!-- Algorithms -->
      <section class="flex flex-col lg:flex-row gap-8">
        <div class="lg:w-2/5">
          <h2 class="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Algorithms</h2>
          <p class="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
            Learn to analyze and optimize sorting, searching, and other fundamental algorithms to build faster, more efficient solutions.
          </p>
        </div>
        <div class="lg:w-3/5">
          <CourseCard
            courseId="algorithms"
            title="Advanced Algorithms"
            description="Master complex algorithms and optimization techniques used in modern software development."
            :image="'/images/algorithms.jpg'"
            :duration="15"
            difficulty="Hard"
          />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import CourseCard from '~/components/CourseCard.vue'

// Auth protection
definePageMeta({
  middleware: ['auth']
})
</script>
