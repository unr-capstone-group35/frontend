<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

useHead({
  title: "Learn | DevQuest",
});
// Set up reactive state inside the component
const route = useRoute();
const router = useRouter();

// Use the composable within the setup function
const {
  sidebarOpen,
  currentExercise,
  currentLesson,
  currentCourse,

  courseStore,
  progressStore,
  exerciseStore,

  getSidebarContainerClasses,
  getSidebarContentClasses,
  toggleSidebar,
  handleAnswerSubmit,
  handleNextExercise,
  updateCurrentExercise,
  calculateCourseProgress,
  getLessonsForCourse,
  isLessonCompleted,
  canAccessLesson,
  getLessonClasses,
  initialize,
  selectLesson,
} = useLearn();

// Initialize the component when mounted - this ensures proper context
onMounted(async () => {
  await initialize();
});

// Navigate to glossary
const navigateToGlossary = () => {
  router.push("/glossary");
};

// Compute total and completed lessons with proper reactivity
const totalLessons = computed(() => {
  return currentCourse.value?.lessons?.length || 0;
});

const completedLessons = computed(() => {
  if (!currentCourse.value?.id || !currentCourse.value?.lessons) return 0;

  const courseId = currentCourse.value.id;
  return currentCourse.value.lessons.filter((lesson) => isLessonCompleted(courseId, lesson.id)).length;
});

// Calculate progress percentage
const progressPercentage = computed(() => {
  if (!currentCourse.value?.id) return 0;
  return calculateCourseProgress(currentCourse.value.id);
});

// Progress bar color based on completion
const progressBarColor = computed(() => {
  if (progressPercentage.value === 100) return "bg-green-500";
  if (progressPercentage.value > 0) return "bg-blue-500";
  return "bg-gray-300";
});
</script>

<template>
  <div class="min-h-page flex flex-col">
    <div class="flex flex-1">
      <!-- Left Sidebar Container -->
      <div class="h-page relative flex transition-all duration-300" :class="getSidebarContainerClasses()">
        <!-- Sidebar Content -->
        <aside
          class="h-full overflow-hidden bg-white shadow-md transition-all duration-300 dark:bg-gray-800"
          :class="getSidebarContentClasses()"
        >
          <div class="flex h-full w-80 flex-col">
            <div class="border-b-2 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <h2 class="mx-6 my-8 text-2xl font-bold dark:text-white">Course Content</h2>
                <button @click="toggleSidebar" class="mr-6 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <svg class="h-6 w-6 text-gray-800 dark:text-white" viewBox="0 0 476.213 476.213" fill="currentColor">
                    <polygon
                      points="476.213,223.107 57.427,223.107 151.82,128.713 130.607,107.5 0,238.106 130.607,368.714 151.82,347.5 57.427,253.107 476.213,253.107"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Course Progress Section -->
            <div v-if="currentCourse" class="border-b px-6 py-4 dark:border-gray-700">
              <div class="space-y-4">
                <h3 class="font-medium text-gray-900 dark:text-white">{{ currentCourse.name }}</h3>
                <div class="mb-2 flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Course Progress</span>
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

            <!-- Lesson List (Always Expanded) -->
            <div v-if="currentCourse?.id" class="flex-1 overflow-y-auto">
              <div class="space-y-2 bg-gray-50 p-4 dark:bg-gray-800/50">
                <template v-if="currentCourse">
                  <button
                    v-for="lesson in getLessonsForCourse(currentCourse.id)"
                    :key="lesson.id"
                    @click="selectLesson(currentCourse.id, lesson.id)"
                    :disabled="!canAccessLesson(currentCourse.id, lesson.id)"
                    :class="getLessonClasses(lesson.id)"
                  >
                    <span>{{ lesson.title }}</span>
                    <span v-if="isLessonCompleted(currentCourse.id, lesson.id)" class="ml-2 text-emerald-500"> ✓ </span>
                  </button>
                </template>
              </div>
            </div>

            <div v-else-if="courseStore.loading" class="p-6 text-center">
              <span class="text-gray-500">Loading course...</span>
            </div>

            <div v-else-if="courseStore.error" class="p-6 text-center">
              <span class="text-red-500">{{ courseStore.error }}</span>
            </div>

            <div v-else class="p-6 text-center text-gray-500">Select a course to begin</div>
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
      <main
        class="relative flex-1 overflow-y-auto bg-gradient-to-b from-slate-100 to-slate-200 p-8 transition-all duration-300 dark:from-gray-950 dark:to-gray-900"
      >
        <!-- Glossary Button -->
        <div class="absolute right-12 top-12">
          <button
            @click="navigateToGlossary"
            class="flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-2 text-white transition-colors hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"
              />
            </svg>
            Glossary
          </button>
        </div>

        <div v-if="courseStore.loading" class="text-center">
          <span class="text-gray-500">Loading content...</span>
        </div>

        <div v-else-if="courseStore.error" class="text-center">
          <span class="text-red-500">{{ courseStore.error }}</span>
        </div>

        <div v-else-if="currentLesson" class="rounded-lg bg-white p-10 dark:bg-gray-800">
          <div class="mb-8">
            <h2 class="mb-4 text-3xl font-semibold text-gray-800 dark:text-white">
              {{ currentLesson.title }}
            </h2>
            <p class="text-gray-600 dark:text-gray-300">
              {{ currentLesson.description }}
            </p>
          </div>

          <QuestionContainer
            v-if="currentExercise"
            :exercise="currentExercise"
            :onSubmitAnswer="(answer: any) => handleAnswerSubmit(answer)"
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
