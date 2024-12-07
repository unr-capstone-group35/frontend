<template>
  <div class="min-h-screen flex flex-col">
    <div class="flex-1 flex bg-gray-100 dark:bg-gray-900">
      <!-- Left Sidebar Container -->
      <div 
        class="relative flex h-screen transition-all duration-300" 
        :class="getSidebarContainerClasses()"
      >
        <!-- Sidebar Content -->
        <aside
          class="transition-all duration-300 bg-white dark:bg-gray-800 shadow-md overflow-hidden h-full"
          :class="getSidebarContentClasses()"
        >
          <div class="w-80 h-full flex flex-col">
            <div class="p-6 border-b dark:border-gray-700">
              <div class="flex items-center justify-between">
                <h2 class="text-2xl font-bold dark:text-white">Course Content</h2>
                <button
                  @click="toggleSidebar"
                  class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <svg
                    class="w-6 h-6 text-gray-800 dark:text-white"
                    viewBox="0 0 476.213 476.213"
                    fill="currentColor"
                  >
                    <polygon points="476.213,223.107 57.427,223.107 151.82,128.713 130.607,107.5 0,238.106 130.607,368.714 151.82,347.5
                      57.427,253.107 476.213,253.107"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="flex-1 overflow-y-auto p-6">
              <div class="space-y-4">
                <div v-for="course in courses" :key="course.id">
                  <button
                    @click="toggleCourse(course.id)"
                    :class="getCourseClasses(course.id)"
                  >
                    <span class="font-medium text-gray-900 dark:text-white">
                      {{ course.name }}
                    </span>
                    <svg
                      :class="[
                        'w-5 h-5 transition-transform',
                        expandedCourse === course.id ? 'rotate-180' : ''
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
                  </button>

                  <!-- Lesson Dropdown -->
                  <div
                    :class="[
                      'overflow-hidden transition-all duration-300',
                      expandedCourse === course.id ? 'max-h-96' : 'max-h-0'
                    ]"
                  >
                    <div class="p-4 space-y-2 bg-gray-50 dark:bg-gray-800/50">
                      <button
                        v-for="lesson in course.lessons"
                        :key="lesson.id"
                        @click="selectExercise(course.id, lesson.id, lesson.exercises[0].id)"
                        :class="getLessonClasses(lesson.id)"
                      >
                        {{ lesson.name }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- button when sidebar closed -->
        <div
          v-if="!sidebarOpen"
          class="absolute left-0 top-0 h-full"
        >
          <button
            @click="toggleSidebar"
            class="flex items-center h-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 px-2"
          >
            <svg
              class="w-6 h-6 text-gray-800 dark:text-white"
              viewBox="0 0 44.952 44.952"
              fill="currentColor"
            >
              <path d="M44.952,22.108c0-1.25-0.478-2.424-1.362-3.308L30.627,5.831c-0.977-0.977-2.561-0.977-3.536,0
                c-0.978,0.977-0.976,2.568,0,3.546l10.574,10.57H2.484C1.102,19.948,0,21.081,0,22.464c0,0.003,0,0.025,0,0.028
                c0,1.382,1.102,2.523,2.484,2.523h35.182L27.094,35.579c-0.978,0.978-0.978,2.564,0,3.541c0.977,0.979,2.561,0.978,3.538-0.001
                l12.958-12.97c0.885-0.882,1.362-2.059,1.362-3.309C44.952,22.717,44.952,22.231,44.952,22.108z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <main class="flex-1 p-8 overflow-y-auto transition-all duration-300">
        <div 
          v-if="currentExercise" 
          class="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-md text-center"
        >
          <h2 class="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
            {{ currentExercise.name }}
          </h2>
          <div class="text-gray-600 dark:text-gray-300">
            {{ currentExercise.content }}
          </div>
        </div>
        <div 
          v-else 
          class="text-center text-gray-500 dark:text-gray-400 text-xl"
        >
          Select an exercise to begin learning.
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCourseStore } from '~/stores/courseStore'

// Add auth protection to this page
definePageMeta({
  middleware: ['auth']
})

const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()

// State
const sidebarOpen = ref(true)
const expandedCourse = ref(null)
const expandedLesson = ref(null)
const currentExercise = ref(null)

const courses = computed(() => {
  const coursesArray = Object.values(courseStore.courses)
  
  return coursesArray.map(course => ({
    id: course.id,
    name: course.name,
    lessons: course.steps.map(step => ({
      id: step.lessonId,
      name: step.title,
      exercises: [{
        id: step.exerciseId,
        name: step.title,
        content: step.description
      }]
    }))
  }))
})

function getSidebarContainerClasses() {
  return !sidebarOpen.value ? 'w-8' : 'w-80'
}

function getSidebarContentClasses() {
  return sidebarOpen.value ? 'w-80' : 'w-0'
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function toggleCourse(courseId) {
  expandedCourse.value = expandedCourse.value === courseId ? null : courseId
  expandedLesson.value = null
}

function toggleLesson(lessonId) {
  expandedLesson.value = expandedLesson.value === lessonId ? null : lessonId
}

function selectExercise(courseId, lessonId, exerciseId) {
  router.push({
    path: '/learn',
    query: { course: courseId, lesson: lessonId, exercise: exerciseId }
  })
}

function isActiveCourse(courseId) {
  return route.query.course === courseId
}

function isActiveLesson(lessonId) {
  return route.query.lesson === lessonId
}

function isActiveExercise(exerciseId) {
  return route.query.exercise === exerciseId
}

function getCourseClasses(courseId) {
  const baseClasses = 'w-full flex items-center justify-between p-4 rounded-lg'
  const activeClasses = 'bg-emerald-100 dark:bg-emerald-900/50'
  const inactiveClasses = 'hover:bg-gray-50 dark:hover:bg-gray-700'
  
  return `${baseClasses} ${isActiveCourse(courseId) ? activeClasses : inactiveClasses}`
}

function getLessonClasses(lessonId) {
  const baseClasses = 'w-full text-left p-2 rounded'
  const activeClasses = 'bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100'
  const inactiveClasses = 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
  
  return `${baseClasses} ${isActiveLesson(lessonId) ? activeClasses : inactiveClasses}`
}

function updateCurrentExercise() {
  const { course: currentCourse, lesson: currentLesson, exercise: currentExerciseId } = route.query

  if (currentCourse && currentLesson && currentExerciseId) {
    const selectedCourse = courses.value.find(course => course.id === currentCourse)
    if (selectedCourse) {
      const selectedLesson = selectedCourse.lessons.find(lesson => lesson.id === currentLesson)
      if (selectedLesson) {
        const selectedExercise = selectedLesson.exercises.find(exercise => exercise.id === currentExerciseId)
        currentExercise.value = selectedExercise
        expandedCourse.value = currentCourse
        expandedLesson.value = currentLesson
      }
    }
  }
}

// Watch for route changes
watch(() => route.query, updateCurrentExercise, { immediate: true })
</script>