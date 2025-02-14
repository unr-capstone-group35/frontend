<!-- components/CourseCard.vue-->
<template>
  <div
    class="mx-auto max-w-lg cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl dark:bg-gray-800"
    :class="{ 'pointer-events-none opacity-50': loading }"
  >
    <!-- Course Image -->
    <div class="relative h-40 w-full bg-gray-100 dark:bg-gray-700">
      <img
        :src="imagePath"
        :alt="courseDisplayName"
        class="h-40 w-full object-cover"
      />
      <!-- Loading overlay -->
      <div
        v-if="loading"
        class="absolute inset-0 flex items-center justify-center bg-gray-900/20 dark:bg-gray-900/40"
      >
        <div
          class="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-500"
        ></div>
      </div>
    </div>

    <div
      class="p-5 transition-colors duration-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
      @click="handleCourseSelect"
    >
      <!-- Course title and description -->
      <h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">
        {{ courseDisplayName }}
      </h3>
      <p class="mb-4 text-sm text-gray-600 dark:text-gray-300">
        {{ courseDescription }}
      </p>

      <!-- Course metadata -->
      <div class="flex items-center justify-between">
        <!-- Lesson count -->
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {{ lessonCount }} lessons
        </span>

        <!-- Progress indicator if user has started the course -->
        <div v-if="progress" class="flex items-center gap-2">
          <div
            class="h-2 w-20 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
          >
            <div
              class="h-full bg-emerald-500 transition-all duration-300"
              :style="{ width: `${progressPercentage}%` }"
            ></div>
          </div>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ progressPercentage }}%
          </span>
        </div>

        <!-- Course status -->
        <span
          v-if="courseStatus"
          class="rounded-full px-3 py-1 text-sm"
          :class="{
            'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100':
              courseStatus === 'completed',
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100':
              courseStatus === 'in_progress',
            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100':
              courseStatus === 'not_started'
          }"
        >
          {{ formatStatus(courseStatus) }}
        </span>
      </div>

      <!-- Error message -->
      <p v-if="error" class="mt-2 text-sm text-red-600 dark:text-red-400">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import { useCourseStore } from "~/stores/courseStore"
import { storeToRefs } from "pinia"

const props = defineProps({
  courseId: {
    type: String,
    required: true
  },
  imagePath: {
    type: String,
    required: true
  }
})

const router = useRouter()
const courseStore = useCourseStore()
const { currentCourse, courseProgress } = storeToRefs(courseStore)

const loading = ref(false)
const error = ref(null)

// Computed properties
const courseDisplayName = computed(() => {
  const names = {
    Algorithms: "Algorithms",
    data_structures: "Data Structures",
    Programming_Basics: "Programming Basics"
  }
  return names[props.courseId] || props.courseId
})

const courseDescription = computed(() => {
  const descriptions = {
    Algorithms: "Master fundamental algorithms and their implementations",
    data_structures: "Learn essential data structures and their applications",
    Programming_Basics: "Get started with programming fundamentals"
  }
  return descriptions[props.courseId] || "Explore this comprehensive course"
})

const courseInitial = computed(() => courseDisplayName.value.charAt(0))

const courseBgColor = computed(() => {
  const colors = {
    Algorithms: "#4F46E5",
    data_structures: "#0891B2",
    Programming_Basics: "#059669"
  }
  return colors[props.courseId] || "#6366F1"
})

const courseIconColor = computed(() => {
  const colors = {
    Algorithms: "#6366F1",
    data_structures: "#0EA5E9",
    Programming_Basics: "#10B981"
  }
  return colors[props.courseId] || "#818CF8"
})

const lessonCount = computed(() => {
  return currentCourse.value?.lessons?.length || 0
})

const progress = computed(() => {
  return courseProgress.value?.[props.courseId]
})

const progressPercentage = computed(() => {
  if (!progress.value) return 0
  const completed =
    currentCourse.value?.lessons?.filter(lesson =>
      courseStore.isLessonCompleted(props.courseId, lesson.lessonId)
    ).length || 0
  return Math.round((completed / lessonCount.value) * 100) || 0
})

const courseStatus = computed(() => {
  if (!progress.value) return "not_started"
  if (progress.value.completedAt) return "completed"
  if (progress.value.startedAt) return "in_progress"
  return "not_started"
})

// Utility functions
const formatStatus = status => {
  const formats = {
    completed: "Completed",
    in_progress: "In Progress",
    not_started: "Start Course"
  }
  return formats[status] || status
}

// Event handlers
const handleCourseSelect = async () => {
  try {
    loading.value = true
    error.value = null

    // Fetch course data
    await courseStore.fetchCourse(props.courseId)

    if (!currentCourse.value?.lessons?.length) {
      throw new Error("No lessons available in this course")
    }

    // Get first lesson
    const firstLesson = currentCourse.value.lessons[0]

    // Navigate to learn page
    await router.push({
      path: "/learn",
      query: {
        course: props.courseId,
        lesson: firstLesson.lessonId
      }
    })
  } catch (err) {
    console.error("Error accessing course:", err)
    error.value = "Unable to access course at this time"
  } finally {
    loading.value = false
  }
}
</script>
