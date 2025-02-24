<script setup>
import { watch, onMounted } from "vue"
import { useRoute } from "vue-router"
import { useLearn } from "~/composables/useLearn"
import QuestionContainer from "~/components/QuestionContainer.vue"

definePageMeta({
  middleware: ["auth"]
})

const route = useRoute()
const {
  sidebarOpen,
  currentExercise,
  courseStore,
  getSidebarContainerClasses,
  getSidebarContentClasses,
  toggleSidebar,
  handleAnswerSubmit,
  handleNextExercise,
  updateCurrentExercise,
  initialize
} = useLearn()

// Initialize
onMounted(initialize)

// Watch for route changes
watch(() => route.query, updateCurrentExercise, { immediate: true })
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <div class="flex flex-1 bg-gray-100 dark:bg-gray-900">
      <!-- Left Sidebar Container -->
      <div class="relative flex h-screen transition-all duration-300" :class="getSidebarContainerClasses()">
        <!-- Sidebar Content -->
        <aside
          class="h-full overflow-hidden bg-white shadow-md transition-all duration-300 dark:bg-gray-800"
          :class="getSidebarContentClasses()"
        >
          <div class="flex h-full w-80 flex-col">
            <div class="border-b p-6 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <h2 class="text-2xl font-bold dark:text-white">Course Content</h2>
                <button @click="toggleSidebar" class="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <svg class="h-6 w-6 text-gray-800 dark:text-white" viewBox="0 0 476.213 476.213" fill="currentColor">
                    <polygon
                      points="476.213,223.107 57.427,223.107 151.82,128.713 130.607,107.5 0,238.106 130.607,368.714 151.82,347.5
                      57.427,253.107 476.213,253.107"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <CourseList
              :loading="courseStore.loading"
              :error="courseStore.error"
              :courses="Object.values(courseStore.courses)"
            />
          </div>
        </aside>

        <!-- Sidebar Toggle Button -->
        <div v-if="!sidebarOpen" class="absolute left-0 top-0 h-full">
          <button
            @click="toggleSidebar"
            class="flex h-full items-center bg-white px-2 shadow-md hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <svg class="h-6 w-6 text-gray-800 dark:text-white" viewBox="0 0 44.952 44.952" fill="currentColor">
              <path
                d="M44.952,22.108c0-1.25-0.478-2.424-1.362-3.308L30.627,5.831c-0.977-0.977-2.561-0.977-3.536,0
                c-0.978,0.977-0.976,2.568,0,3.546l10.574,10.57H2.484C1.102,19.948,0,21.081,0,22.464c0,0.003,0,0.025,0,0.028
                c0,1.382,1.102,2.523,2.484,2.523h35.182L27.094,35.579c-0.978,0.978-0.978,2.564,0,3.541c0.977,0.979,2.561,0.978,3.538-0.001
                l12.958-12.97c0.885-0.882,1.362-2.059,1.362-3.309C44.952,22.717,44.952,22.231,44.952,22.108z"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto p-8 transition-all duration-300">
        <div v-if="courseStore.loading" class="text-center">
          <span class="text-gray-500">Loading content...</span>
        </div>

        <div v-else-if="courseStore.error" class="text-center">
          <span class="text-red-500">{{ courseStore.error }}</span>
        </div>

        <div v-else-if="courseStore.currentLesson" class="rounded-lg bg-white p-10 shadow-md dark:bg-gray-800">
          <div class="mb-8">
            <h2 class="mb-4 text-3xl font-semibold text-gray-800 dark:text-white">
              {{ courseStore.currentLesson.title }}
            </h2>
            <p class="text-gray-600 dark:text-gray-300">
              {{ courseStore.currentLesson.description }}
            </p>
          </div>

          <QuestionContainer
            v-if="currentExercise"
            :exercise="currentExercise"
            :onSubmitAnswer="answer => handleAnswerSubmit(answer)"
            @next-exercise="handleNextExercise"
          />
        </div>

        <div v-else class="text-center text-xl text-gray-500 dark:text-gray-400">
          Select a lesson to begin learning.
        </div>
      </main>
    </div>
  </div>
</template>
