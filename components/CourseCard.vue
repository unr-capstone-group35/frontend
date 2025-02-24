<script setup lang="ts">
const props = defineProps<{
  courseId: string
  imagePath: string
}>()

const router = useRouter()
const courseStore = useCourseStore()

const loading = ref(false)
const error = ref("")

// Computed properties

const courseInitial = computed(() => courseStore.courses[props.courseId].name.charAt(0))

const courseBgColor = computed((): string => {
  const colors: { [key: string]: string } = {
    algorithms: "#4F46E5",
    data_structures: "#0891B2",
    programming_basics: "#059669"
  }
  return colors[props.courseId] || "#6366F1"
})

const courseIconColor = computed((): string => {
  const colors: { [key: string]: string } = {
    algorithms: "#6366F1",
    data_structures: "#0EA5E9",
    programming_basics: "#10B981"
  }
  return colors[props.courseId] || "#818CF8"
})

const progress = computed(() => {
  return courseStore.courseProgress[props.courseId]
})

const progressPercentage = computed(() => {
  if (!progress.value) return 0
  const completed =
    courseStore.courses[props.courseId].lessons?.filter(lesson =>
      courseStore.isLessonCompleted(props.courseId, lesson.id)
    ).length || 0
  return Math.round((completed / courseStore.courses[props.courseId].lessonAmount) * 100) || 0
})

const courseStatus = computed(() => {
  if (!progress.value) return "not_started"
  if (progress.value.completedAt) return "completed"
  if (progress.value.startedAt) return "in_progress"
  return "not_started"
})

// Utility functions
const formatStatus = (status: Status) => {
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
    error.value = ""

    // Fetch course data
    await courseStore.fetchCourse(props.courseId)

    if (!courseStore.courses[props.courseId].lessons) {
      throw new Error("No lessons available in this course")
    }

    if (!courseStore.courses[props.courseId].lessons![0]) {
      throw new Error("First lesson not available in this course")
    }

    // Get first lesson
    const firstLesson = courseStore.courses[props.courseId].lessons![0]

    // Navigate to learn page
    await router.push({
      path: "/learn",
      query: {
        course: props.courseId,
        lesson: firstLesson.id
      }
    })
  } catch (err: any) {
    console.error("Error accessing course:", err)
    error.value = "Unable to access course at this time"
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    class="mx-auto max-w-lg cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl dark:bg-gray-800"
    :class="{ 'pointer-events-none opacity-50': loading }"
  >
    <!-- Course Image -->
    <div class="relative h-40 w-full bg-gray-100 dark:bg-gray-700">
      <img :src="imagePath" :alt="courseStore.courses[courseId].name" class="h-40 w-full object-cover" />
      <!-- Loading overlay -->
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-gray-900/20 dark:bg-gray-900/40">
        <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-500"></div>
      </div>
    </div>

    <div
      class="p-5 transition-colors duration-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
      @click="handleCourseSelect"
    >
      <!-- Course title and description -->
      <h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">
        {{ courseStore.courses[courseId].name }}
      </h3>
      <p class="mb-4 text-sm text-gray-600 dark:text-gray-300">
        {{ courseStore.courses[courseId].description }}
      </p>

      <!-- Course metadata -->
      <div class="flex items-center justify-between">
        <!-- Lesson count -->
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {{ courseStore.courses[courseId].lessonAmount }} lessons
        </span>

        <!-- Progress indicator if user has started the course -->
        <div v-if="progress" class="flex items-center gap-2">
          <div class="h-2 w-20 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              class="h-full bg-emerald-500 transition-all duration-300"
              :style="{ width: `${progressPercentage}%` }"
            ></div>
          </div>
          <span class="text-sm text-gray-500 dark:text-gray-400"> {{ progressPercentage }}% </span>
        </div>

        <!-- Course status -->
        <span
          v-if="courseStatus"
          class="rounded-full px-3 py-1 text-sm"
          :class="{
            'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100': courseStatus === 'completed',
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100': courseStatus === 'in_progress',
            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100': courseStatus === 'not_started'
          }"
        >
          {{ formatStatus(courseStatus) }}
        </span>
      </div>

      <!-- Error message -->
      <p v-if="error != ''" class="mt-2 text-sm text-red-600 dark:text-red-400">
        {{ error }}
      </p>
    </div>
  </div>
</template>
