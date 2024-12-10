<template>
  <div class="min-h-screen bg-gradient-to-b from-white dark:from-gray-900 to-green-50 dark:to-gray-800">
    <main class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-12 py-12 sm:py-16 lg:py-24">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center min-h-[50vh]">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600 dark:text-red-400 text-lg">
          {{ error }}
        </p>
        <button 
          @click="fetchCourses"
          class="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          Retry
        </button>
      </div>

      <!-- Content -->
      <div v-else class="space-y-24">
        <!-- Programming Basics Section -->
        <section 
          class="flex flex-col lg:flex-row gap-8 pb-12 border-b border-gray-200 dark:border-gray-700"
        >
          <div class="lg:w-2/5">
            <h2 class="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Programming Fundamentals</h2>
            <p class="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
              Start your coding journey here. Learn variables, functions, loops, and essential programming concepts 
              through interactive exercises and practical examples.
            </p>
            <ul class="list-disc list-inside text-gray-600 dark:text-gray-300">
              <li>Master basic programming concepts</li>
              <li>Write your first programs</li>
              <li>Learn problem-solving techniques</li>
            </ul>
          </div>
          <div class="lg:w-3/5">
            <CourseCard courseId="Programming_Basics" />
          </div>
        </section>

        <!-- Data Structures Section -->
        <section 
          class="flex flex-col lg:flex-row gap-8 pb-12 border-b border-gray-200 dark:border-gray-700"
        >
          <div class="lg:w-2/5">
            <h2 class="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Data Structures</h2>
            <p class="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
              Learn how to organize and store data efficiently. Master fundamental data structures 
              used in modern software development.
            </p>
            <ul class="list-disc list-inside text-gray-600 dark:text-gray-300">
              <li>Arrays and Linked Lists</li>
              <li>Stacks and Queues</li>
              <li>Trees and Graphs</li>
            </ul>
          </div>
          <div class="lg:w-3/5">
            <CourseCard courseId="Data_Structures" />
          </div>
        </section>

        <!-- Algorithms Section -->
        <section class="flex flex-col lg:flex-row gap-8">
          <div class="lg:w-2/5">
            <h2 class="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Algorithms</h2>
            <p class="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
              Master essential algorithms and computational problem-solving. Learn to analyze and implement 
              efficient solutions to complex problems.
            </p>
            <ul class="list-disc list-inside text-gray-600 dark:text-gray-300">
              <li>Sorting and Searching</li>
              <li>Recursion and Dynamic Programming</li>
              <li>Algorithm Analysis</li>
            </ul>
          </div>
          <div class="lg:w-3/5">
            <CourseCard courseId="Algorithms" />
          </div>
        </section>

        <!-- Empty State -->
        <section v-if="!courses || Object.keys(courses).length === 0" class="text-center py-12">
          <div class="max-w-md mx-auto">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              No Courses Available
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              We're currently preparing course content. Please check back later.
            </p>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCourseStore } from '~/stores/courseStore'
import { storeToRefs } from 'pinia'
import CourseCard from '~/components/CourseCard.vue'

// Auth protection
definePageMeta({
  middleware: ['auth']
})

const courseStore = useCourseStore()
const { courses } = storeToRefs(courseStore)
const loading = ref(true)
const error = ref(null)

// Fetch courses
const fetchCourses = async () => {
  try {
    loading.value = true
    error.value = null
    await courseStore.fetchCourses()
  } catch (err) {
    console.error('Error fetching courses:', err)
    error.value = 'Unable to load courses. Please try again later.'
  } finally {
    loading.value = false
  }
}

// Initialize on mount
onMounted(fetchCourses)
</script>