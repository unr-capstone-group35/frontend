<script setup lang="ts">
// Auth protection
definePageMeta({
  middleware: ["auth"],
});

useHead({
  title: "Start Learning | DevQuest",
});

const courseStore = useCourseStore();
const { courses } = storeToRefs(courseStore);
const loading = ref(true);
const error = ref("");

// Fetch courses - just the basic course info
const fetchCourses = async () => {
  try {
    loading.value = true;
    error.value = "";

    // Fetch basic course info - this is lightweight and doesn't include all lesson details
    await courseStore.fetchCourses();

    // Don't try to load all course details here - let the CourseCard components handle that
    // This makes the dashboard load faster
  } catch (err: any) {
    console.error("Error fetching courses:", err);
    error.value = "Unable to load courses. Please try again later.";
  } finally {
    loading.value = false;
  }
};

// Initialize on mount
onMounted(fetchCourses);
</script>

<template>
  <div class="page-container">
    <main class="mx-auto max-w-7xl p-4 py-12 sm:p-6 sm:py-16 lg:p-12 lg:py-24">
      <!-- Loading State -->
      <div v-if="loading" class="flex min-h-[50vh] items-center justify-center">
        <div class="border-primary h-12 w-12 animate-spin rounded-full border-b-2"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error != ''" class="py-12 text-center">
        <p class="text-lg text-red-600 dark:text-red-400">
          {{ error }}
        </p>
        <button
          @click="fetchCourses"
          class="bg-primary hover-primary mt-4 rounded-lg px-4 py-2 text-white transition-colors"
        >
          Retry
        </button>
      </div>

      <!-- Content -->
      <div v-else class="space-y-24">
        <!-- Programming Basics Section -->
        <section class="flex flex-col gap-8 border-b border-gray-200 pb-12 dark:border-gray-700 lg:flex-row">
          <div class="lg:w-2/5">
            <h2 class="mb-6 text-4xl font-bold">Programming Fundamentals</h2>
            <p class="mb-6 text-lg leading-relaxed">
              Start your coding journey here. Learn variables, functions, loops, and essential programming concepts
              through interactive exercises and practical examples.
            </p>
            <ul class="list-inside list-disc text-gray-600 dark:text-gray-300">
              <li>Master basic programming concepts</li>
              <li>Practice through interactive exercises</li>
              <li>Learn problem-solving techniques</li>
            </ul>
          </div>
          <div class="lg:w-3/5">
            <CourseCard courseId="programming_basics" imagePath="/images/basics3.jpg" />
          </div>
        </section>

        <!-- Data Structures Section -->
        <section class="flex flex-col gap-8 border-b border-gray-200 pb-12 dark:border-gray-700 lg:flex-row">
          <div class="lg:w-2/5">
            <h2 class="mb-6 text-4xl font-bold">Data Structures</h2>
            <p class="mb-6 text-lg leading-relaxed">
              Learn how to organize and store data efficiently. Master fundamental data structures used in modern
              software development.
            </p>
            <ul class="list-inside list-disc text-gray-600 dark:text-gray-300">
              <li>Arrays and Linked Lists</li>
              <li>Stacks and Queues</li>
              <li>Trees and Graphs</li>
            </ul>
          </div>
          <div class="lg:w-3/5">
            <CourseCard courseId="data_structures" imagePath="/images/data-structures2.jpg" />
          </div>
        </section>

        <!-- Algorithms Section -->
        <section class="flex flex-col gap-8 lg:flex-row">
          <div class="lg:w-2/5">
            <h2 class="mb-6 text-4xl font-bold">Algorithms</h2>
            <p class="mb-6 text-lg leading-relaxed">
              Master essential algorithms and computational problem-solving. Learn to analyze and implement efficient
              solutions to complex problems.
            </p>
            <ul class="list-inside list-disc text-gray-600 dark:text-gray-300">
              <li>Sorting and Searching</li>
              <li>Recursion and Dynamic Programming</li>
              <li>Algorithm Analysis</li>
            </ul>
          </div>
          <div class="lg:w-3/5">
            <CourseCard courseId="algorithms" imagePath="/images/algorithms.jpg" />
          </div>
        </section>

        <!-- Empty State -->
        <section v-if="!courses || Object.keys(courses).length === 0" class="py-12 text-center">
          <div class="mx-auto max-w-md">
            <h3 class="mb-4 text-xl font-semibold">No Courses Available</h3>
            <p>We're currently preparing course content. Please check back later.</p>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>
