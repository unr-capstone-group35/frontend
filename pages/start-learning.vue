<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-green-50 p-8">
    <main class="max-w-7xl mx-auto space-y-24">
      <!-- Computer Science Basics -->
      <section class="flex flex-col lg:flex-row gap-8">
        <div class="lg:w-2/5">
          <h2 class="text-4xl font-bold mb-6 text-gray-900">Computer Science Basics</h2>
          <p class="text-gray-600 text-lg leading-relaxed mb-6">
            Master the fundamental concepts of computer science and programming. Build a strong foundation in computational thinking and problem-solving skills essential for any programming journey.
          </p>
        </div>
        <div class="lg:w-3/5">
          <CourseCard
            title="Programming Fundamentals"
            description="Learn the basics of programming and computational thinking through hands-on exercises and real-world examples."
            :image="'/images/basics.jpg'"
            :duration="12"
            difficulty="Beginner"
          />
        </div>
      </section>
      <!-- Data Structures -->
      <section class="flex flex-col lg:flex-row gap-8">
        <div class="lg:w-2/5">
          <h2 class="text-4xl font-bold mb-6 text-gray-900">Data Structures</h2>
          <p class="text-gray-600 text-lg leading-relaxed mb-6">
            Dive deep into essential data structures that power modern software. Learn how to organize and manage data efficiently for optimal performance and scalability.
          </p>
        </div>
        <div class="lg:w-3/5">
          <CourseCard
            title="Data Structures for Beginners"
            description="Master fundamental data structures like arrays, linked lists, and trees with practical implementations."
            :image="'/images/data-structures.jpg'"
            :duration="24"
            difficulty="Medium"
          />
        </div>
      </section>
      <!-- Algorithms -->
      <section class="flex flex-col lg:flex-row gap-8">
        <div class="lg:w-2/5">
          <h2 class="text-4xl font-bold mb-6 text-gray-900">Algorithms</h2>
          <p class="text-gray-600 text-lg leading-relaxed mb-6">
            Master the art of problem-solving with algorithms. Learn essential techniques for designing efficient solutions to complex computational problems.
          </p>
        </div>
        <div class="lg:w-3/5">
          <CourseCard
            title="Advanced Algorithms"
            description="Master complex algorithms and optimization techniques used in modern software development."
            :image="'/images/algorithms.jpg'"
            :duration="25"
            difficulty="Hard"
          />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import CourseCard from '~/components/CourseCard.vue'
</script>