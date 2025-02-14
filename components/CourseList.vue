<!-- components/CourseList.vue -->
<template>
  <div class="flex h-full flex-col">
    <!-- Add User Progress Component -->
    <div v-if="activeCourse" class="border-b px-6 py-4 dark:border-gray-700">
      <div class="space-y-4">
        <div class="mb-2 flex items-center justify-between">
          <h3 class="font-medium text-gray-700 dark:text-gray-300">
            Course Progress
          </h3>
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
            {{ completedLessons }} of {{ totalLessons }} lessons
          </span>
        </div>

        <!-- Overall Progress Bar -->
        <div class="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            class="h-full transition-all duration-300 ease-in-out"
            :class="progressBarColor"
            :style="{ width: `${progressPercentage}%` }"
          ></div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="p-6 text-center">
      <span class="text-gray-500">Loading courses...</span>
    </div>

    <div v-else-if="error" class="p-6 text-center">
      <span class="text-red-500">{{ error }}</span>
    </div>

    <div v-else class="flex-1 overflow-y-auto p-6">
      <div class="space-y-4">
        <div v-if="activeCourse">
          <button
            @click="toggleCourse(activeCourse.id)"
            :class="getCourseClasses(activeCourse.id)"
          >
            <div class="flex w-full flex-col">
              <div class="mb-2 flex items-center justify-between">
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ formatCourseName(activeCourse.name) }}
                </span>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-500">
                    {{ progressPercentage }}%
                  </span>
                  <svg
                    :class="[
                      'h-5 w-5 transition-transform',
                      expandedCourse === activeCourse.id ? 'rotate-180' : ''
                    ]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              <!-- Progress bar -->
              <div
                class="h-1.5 w-full overflow-hidden rounded-full bg-gray-200"
              >
                <div
                  class="h-full rounded-full transition-all duration-300 ease-in-out"
                  :class="progressBarColor"
                  :style="{ width: `${progressPercentage}%` }"
                ></div>
              </div>
            </div>
          </button>

          <LessonList
            v-if="expandedCourse === activeCourse.id"
            :courseId="activeCourse.id"
            :lessons="getLessonsForCourse(activeCourse.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useRoute } from "vue-router"
import { useLearn } from "~/composables/useLearn"
import { storeToRefs } from "pinia"
import { useCourseStore } from "~/stores/courseStore"
import LessonList from "./LessonList.vue"

const props = defineProps({
  loading: Boolean,
  error: String,
  courses: {
    type: Array,
    required: true
  }
})

const route = useRoute()
const courseStore = useCourseStore()
const { currentCourse, courseProgress } = storeToRefs(courseStore)

const { expandedCourse, toggleCourse, getLessonsForCourse, getCourseClasses } =
  useLearn()

// Compute active course based on route
const activeCourse = computed(() => {
  return props.courses.find(course => course.id === route.query.course)
})

// Calculate total and completed lessons
const totalLessons = computed(() => {
  return currentCourse.value?.lessons?.length || 0
})

const completedLessons = computed(() => {
  if (!activeCourse.value || !currentCourse.value?.lessons) return 0

  return currentCourse.value.lessons.filter(lesson =>
    courseStore.isLessonCompleted(activeCourse.value.id, lesson.lessonId)
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

function formatCourseName(name) {
  return name.replace(/_/g, " ")
}
</script>
