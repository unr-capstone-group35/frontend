<script setup lang="ts">
const props = defineProps<{
  courseId: string
  imagePath: string
}>()

const router = useRouter()
const courseStore = useCourseStore()
const progressStore = useProgressStore()

const loading = ref(false)
const error = ref("")
const dataLoaded = ref(false)

// Computed properties
const course = computed(() => courseStore.courses[props.courseId])
const progress = computed(() => progressStore.getCourseProgress(props.courseId))

const courseDifficulty = computed((): { text: string; bgClass: string } => {
  const difficulties: { [key: string]: { text: string; bgClass: string } } = {
    algorithms: { text: "Hard", bgClass: "bg-red-500" },
    data_structures: { text: "Medium", bgClass: "bg-yellow-400" },
    programming_basics: { text: "Easy", bgClass: "bg-emerald-500" }
  }
  return difficulties[props.courseId] || { text: "Medium", bgClass: "bg-yellow-400" }
})

const buttonBgColor = computed((): string => {
  return "bg-blue-600 hover:bg-blue-700"
})

// Load all required data
const loadCourseData = async () => {
  try {
    loading.value = true
    error.value = ""
    
    await courseStore.fetchCourse(props.courseId)
    
    await progressStore.fetchCourseProgress(props.courseId)
    
    if (course.value?.lessons) {
      for (const lesson of course.value.lessons) {
        await progressStore.fetchLessonProgress(props.courseId, lesson.id)
      }
    }
    
    dataLoaded.value = true
  } catch (err) {
    console.error(`Error loading course data for ${props.courseId}:`, err)
    error.value = "Failed to load course data"
  } finally {
    loading.value = false
  }
}

// Use the course store method to calculate progress
const progressPercentage = computed(() => {
  if (dataLoaded.value && course.value?.lessons) {
    return courseStore.calculateCourseProgress(props.courseId)
  }
  return progress.value?.progressPercentage || 0
})

const courseStatus = computed((): Status => {
  if (!progress.value) return "not_started"
  return progress.value.status || "not_started"
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
    
    await courseStore.fetchCourse(props.courseId)
    
    const currentCourse = courseStore.courses[props.courseId]
    if (!currentCourse?.lessons || currentCourse.lessons.length === 0) {
      throw new Error("No lessons available in this course")
    }

    // Get first lesson
    const firstLesson = currentCourse.lessons[0]

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

// Load data on component mount
onMounted(loadCourseData)
</script>

<template>
  <div
    class="mx-auto max-w-lg cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl dark:bg-gray-800"
    :class="{ 'pointer-events-none opacity-50': loading }"
  >
    <!-- Course Image -->
    <div class="relative h-40 w-full bg-gray-100 dark:bg-gray-700">
      <img :src="imagePath" :alt="course?.name" class="h-40 w-full object-cover" />
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
        {{ course?.name }}
      </h3>
      <p class="mb-4 text-sm text-gray-600 dark:text-gray-300">
        {{ course?.description }}
      </p>

      <!-- Course metadata -->
      <div class="flex items-center justify-between">
        <!-- Lesson count and difficulty label -->
        <div class="flex items-center space-x-3">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ course?.lessonAmount }} lessons
          </span>
          <span class="rounded-full px-3 py-1 text-sm font-medium text-white" :class="courseDifficulty.bgClass">
            {{ courseDifficulty.text }}
          </span>
        </div>

        <!-- Progress indicator if user has started the course -->
        <div v-if="progress" class="flex items-center gap-2">
          <div class="h-2 w-20 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              class="h-full transition-all duration-300"
              :class="{
                'bg-emerald-500': courseId === 'programming_basics',
                'bg-blue-500': courseId === 'data_structures',
                'bg-red-500': courseId === 'algorithms',
                'bg-indigo-500': !['programming_basics', 'data_structures', 'algorithms'].includes(courseId)
              }"
              :style="{ width: `${progressPercentage}%` }"
            ></div>
          </div>
          <span class="text-sm text-gray-500 dark:text-gray-400">{{ progressPercentage }}%</span>
        </div>

        <!-- Start Course Button -->
        <button
          v-if="courseStatus === 'not_started'"
          @click.stop="handleCourseSelect"
          class="rounded-full px-3 py-1 text-sm font-medium text-white transition-colors"
          :class="buttonBgColor"
        >
          Start Course
        </button>

        <!-- Course status (for in progress/completed) -->
        <span
          v-else
          class="rounded-full px-3 py-1 text-sm"
          :class="{
            'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100': courseStatus === 'completed',
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100': courseStatus === 'in_progress'
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