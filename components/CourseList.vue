<script setup lang="ts">

const props = withDefaults(
  defineProps<{
    loading: boolean
    error: string
    courses: Course[]
  }>(),
  {
    loading: false,
    error: ""
  }
)

const route = useRoute()
const courseStore = useCourseStore()
const progressStore = useProgressStore()
const { currentCourse } = storeToRefs(courseStore)

const { expandedCourseId, toggleCourse, getLessonsForCourse, getCourseClasses } = useLearn()

// Compute active course based on route
const activeCourse = computed(() => {
  return props.courses.find((course: Course) => course.id === (route.query.course as string))
})

// Calculate total and completed lessons
const totalLessons = computed(() => {
  return currentCourse.value?.lessons?.length || 0
})

const completedLessons = computed(() => {
  if (!activeCourse.value || !currentCourse.value?.lessons) return 0

  if (!activeCourse.value.id) {
    return 0
  }

  // Use the progress store to check if lessons are completed
  return currentCourse.value.lessons.filter(lesson => 
    progressStore.isLessonCompleted(activeCourse.value!.id, lesson.id)
  ).length
})

// Calculate progress percentage
const progressPercentage = computed(() => {
  if (!activeCourse.value) return 0
  
  // Use the course store's calculation method
  return courseStore.calculateCourseProgress(activeCourse.value.id)
})

// Progress bar color based on completion
const progressBarColor = computed(() => {
  if (progressPercentage.value === 100) return "bg-green-500"
  if (progressPercentage.value > 0) return "bg-blue-500"
  return "bg-gray-300"
})
</script>
<template>
  <div class="flex h-full flex-col">
    <!-- Add User Progress Component -->
    <div v-if="activeCourse" class="border-b px-6 py-4 dark:border-gray-700">
      <div class="space-y-4">
        <div class="mb-2 flex items-center justify-between">
          <h3 class="font-medium text-gray-700 dark:text-gray-300">Course Progress</h3>
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
          <button @click="toggleCourse(activeCourse.id)" :class="getCourseClasses(activeCourse.id)">
            <div class="flex w-full flex-col">
              <div class="mb-2 flex items-center justify-between">
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ activeCourse.name }}
                </span>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-500"> {{ progressPercentage }}% </span>
                  <svg
                    :class="['h-5 w-5 transition-transform', expandedCourseId === activeCourse.id ? 'rotate-180' : '']"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <!-- Progress bar -->
              <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  class="h-full rounded-full transition-all duration-300 ease-in-out"
                  :class="progressBarColor"
                  :style="{ width: `${progressPercentage}%` }"
                ></div>
              </div>
            </div>
          </button>

          <LessonList
            v-if="expandedCourseId === activeCourse.id"
            :courseId="activeCourse.id"
            :lessons="getLessonsForCourse(activeCourse.id)"
          />
        </div>
        
        <!-- Other courses section -->
        <div v-for="course in props.courses.filter(c => c.id !== activeCourse?.id)" :key="course.id">
          <button @click="toggleCourse(course.id)" :class="getCourseClasses(course.id)">
            <span class="font-medium text-gray-900 dark:text-white">{{ course.name }}</span>
            <svg
              :class="['h-5 w-5 transition-transform', expandedCourseId === course.id ? 'rotate-180' : '']"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <LessonList
            v-if="expandedCourseId === course.id"
            :courseId="course.id"
            :lessons="getLessonsForCourse(course.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>