<!-- learn.vue -->
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

            <div v-if="courseStore.loading" class="p-6 text-center">
              <span class="text-gray-500">Loading courses...</span>
            </div>

            <div v-else-if="courseStore.error" class="p-6 text-center">
              <span class="text-red-500">{{ courseStore.error }}</span>
            </div>

            <div v-else class="flex-1 overflow-y-auto p-6">
              <div class="space-y-4">
                <div v-for="course in Object.values(courseStore.courses)" :key="course.id">
                  <button
                    @click="toggleCourse(course.id)"
                    :class="getCourseClasses(course.id)"
                  >
                    <span class="font-medium text-gray-900 dark:text-white">
                      {{ course.name }}
                    </span>
                    <div class="flex items-center gap-2">
                      <span class="text-sm text-gray-500">
                        {{ getCourseProgress(course.id) }}%
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
                    </div>
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
                        v-for="lesson in currentCourse?.lessons"
                        :key="lesson.lessonId"
                        @click="selectLesson(course.id, lesson.lessonId)"
                        :disabled="!canAccessLesson(course.id, lesson.lessonId)"
                        :class="getLessonClasses(lesson.lessonId)"
                      >
                        <span>{{ lesson.title }}</span>
                        <span v-if="isLessonCompleted(course.id, lesson.lessonId)" 
                              class="ml-2 text-emerald-500">✓</span>
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
        <div v-if="courseStore.loading" class="text-center">
          <span class="text-gray-500">Loading content...</span>
        </div>
        
        <div v-else-if="courseStore.error" class="text-center">
          <span class="text-red-500">{{ courseStore.error }}</span>
        </div>
        
        <div 
          v-else-if="courseStore.currentLesson" 
          class="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-md"
        >
          <div class="mb-8">
            <h2 class="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
              {{ courseStore.currentLesson.title }}
            </h2>
            <p class="text-gray-600 dark:text-gray-300">
              {{ courseStore.currentLesson.description }}
            </p>
          </div>

          <QuestionContainer
            v-if="currentExercise"
            :exercise="currentExercise"
            @submit-answer="handleAnswerSubmit"
            @next-exercise="handleNextExercise"
          />
        </div>
        <div 
          v-else 
          class="text-center text-gray-500 dark:text-gray-400 text-xl"
        >
          Select a lesson to begin learning.
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCourseStore } from '~/stores/courseStore'
import QuestionContainer from '~/components/questions/QuestionContainer.vue'

definePageMeta({
  middleware: ['auth']
})

const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()

const sidebarOpen = ref(true)
const expandedCourse = ref(null)
const currentExercise = ref(null)

// Load courses when component mounts
onMounted(async () => {
  await courseStore.fetchCourses()
  
  // If there are query params, load the specific course and lesson
  if (route.query.course) {
    await courseStore.fetchCourse(route.query.course)
    
    if (route.query.lesson) {
      await courseStore.fetchLesson(route.query.course, route.query.lesson)
      updateCurrentExercise()
    }
  }
})

async function handleAnswerSubmit(answer) {
  if (!currentExercise.value) return

  try {
    const result = await courseStore.submitExerciseAttempt(
      route.query.course,
      route.query.lesson,
      currentExercise.value.id,
      answer
    )
    
    return result.isCorrect
  } catch (error) {
    console.error('Error submitting answer:', error)
    return false
  }
}

async function handleNextExercise() {
  const nextExercise = courseStore.nextExercise(
    route.query.course,
    route.query.lesson,
    currentExercise.value?.id
  )

  if (nextExercise) {
    currentExercise.value = nextExercise
  } else {
    // Move to next lesson
    await router.push('/dashboard') // Or show completion message
  }
}

async function selectLesson(courseId, lessonId) {
  if (!canAccessLesson(courseId, lessonId)) return
  
  await router.push({
    path: '/learn',
    query: { course: courseId, lesson: lessonId }
  })
  
  await courseStore.fetchLesson(courseId, lessonId)
  updateCurrentExercise()
}

function updateCurrentExercise() {
  if (courseStore.currentLesson?.exercises?.length > 0) {
    currentExercise.value = courseStore.currentLesson.exercises[0]
  }
}

function canAccessLesson(courseId, lessonId) {
  // First lesson is always accessible
  if (courseStore.currentCourse?.lessons[0]?.lessonId === lessonId) return true
  
  // Check if previous lesson is completed
  const lessons = courseStore.currentCourse?.lessons
  const lessonIndex = lessons?.findIndex(l => l.lessonId === lessonId)
  if (lessonIndex <= 0) return false
  
  return courseStore.isLessonCompleted(courseId, lessons[lessonIndex - 1].lessonId)
}

function getCourseProgress(courseId) {
  const progress = courseStore.courseProgress(courseId)
  return Math.round(progress.progress * 100)
}

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

// Watch for route changes
watch(() => route.query, updateCurrentExercise, { immediate: true })
</script>