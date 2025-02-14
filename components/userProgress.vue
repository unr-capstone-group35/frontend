<!-- components/UserProgress.vue -->
<template>
  <div class="border-b px-6 py-4 dark:border-gray-700">
    <div class="space-y-4">
      <!-- Course Progress Section -->
      <div v-if="currentCourse">
        <div class="mb-2 flex items-center justify-between">
          <h3 class="font-medium text-gray-700 dark:text-gray-300">
            Course Progress
          </h3>
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
            {{ progressPercentage }}%
          </span>
        </div>

        <!-- Progress Bar -->
        <div class="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            class="h-full transition-all duration-300 ease-in-out"
            :class="progressBarColor"
            :style="{ width: `${progressPercentage}%` }"
          ></div>
        </div>

        <!-- Stats -->
        <div class="mt-4 grid grid-cols-2 gap-4">
          <div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <div class="text-sm text-gray-500 dark:text-gray-400">
              Completed
            </div>
            <div class="font-medium text-gray-900 dark:text-white">
              {{ completedLessons }}/{{ totalLessons }} lessons
            </div>
          </div>
          <div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <div class="text-sm text-gray-500 dark:text-gray-400">
              Time Spent
            </div>
            <div class="font-medium text-gray-900 dark:text-white">
              {{ formatTimeSpent }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { storeToRefs } from "pinia"
import { useCourseStore } from "~/stores/courseStore"

const courseStore = useCourseStore()
const { currentCourse, lessonProgress } = storeToRefs(courseStore)

// Calculate total and completed lessons
const totalLessons = computed(() => currentCourse.value?.lessons?.length || 0)

const completedLessons = computed(() => {
  if (!currentCourse.value) return 0

  return currentCourse.value.lessons.filter(
    lesson =>
      lessonProgress.value[`${currentCourse.value.id}-${lesson.lessonId}`]
        ?.status === "completed"
  ).length
})

// Calculate progress percentage
const progressPercentage = computed(() => {
  if (!totalLessons.value) return 0
  return Math.round((completedLessons.value / totalLessons.value) * 100)
})

// Progress bar color based on completion
const progressBarColor = computed(() => {
  if (progressPercentage.value === 100) return "bg-green-500"
  if (progressPercentage.value > 0) return "bg-blue-500"
  return "bg-gray-300"
})

// Format time spent (placeholder for now)
const formatTimeSpent = computed(() => {
  // This can be enhanced to track actual time spent
  return "0h 0m"
})
</script>
