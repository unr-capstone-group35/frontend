export function useLearn() {
  const router = useRouter()
  const route = useRoute()
  const courseStore = useCourseStore()
  const { currentCourse, currentLesson, courseProgress } = storeToRefs(courseStore)

  // Navigation state
  const sidebarOpen = ref<boolean>(true)
  const expandedCourseId = ref<string>("")
  const expandedLessonId = ref<string>("")
  const currentExercise = ref<Exercise | null>(null)

  // Navigation methods
  function getSidebarContainerClasses() {
    return !sidebarOpen.value ? "w-8" : "w-80"
  }

  function getSidebarContentClasses() {
    return sidebarOpen.value ? "w-80" : "w-0"
  }

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  async function toggleCourse(courseId: string) {
    expandedCourseId.value = courseId
    expandedLessonId.value = ""
    if (expandedCourseId.value != "") {
      await courseStore.fetchCourse(courseId)
      await courseStore.fetchCourseProgress(courseId)
    }
  }

  function toggleLesson(lessonId: string) {
    expandedLessonId.value = lessonId
  }

  // Progress tracking
  function getCourseProgress(courseId: string) {
    try {
      if (!courseProgress.value || !courseProgress.value[courseId]) {
        return 0
      }
      return Math.round(courseProgress.value[courseId].progressPercentage || 0)
    } catch (error) {
      console.error(`Error fetching course progress for ${courseId}:`, error)
      return 0
    }
  }

  function canAccessLesson(courseId: string, lessonId: string) {
    const lessons = currentCourse.value?.lessons || []

    // First lesson is always accessible
    if (lessons[0]?.id === lessonId) return true

    const lessonIndex = lessons.findIndex(l => l.id === lessonId)
    if (lessonIndex <= 0) return false

    // Check all previous lessons up to this one
    // If ANY previous lesson is completed, all lessons up to that point are accessible
    for (let i = lessonIndex - 1; i >= 0; i--) {
      if (courseStore.isLessonCompleted(courseId, lessons[i].id)) {
        return true
      }
    }

    return false
  }

  const getLessonsForCourse = computed(() => (courseId: string) => {
    if (!currentCourse.value || currentCourse.value.id !== courseId) {
      return []
    }
    return currentCourse.value.lessons || []
  })

  // UI state
  function isActiveCourse(courseId: string) {
    return route.query.course === courseId
  }

  function isActiveLesson(lessonId: string) {
    return route.query.lesson === lessonId
  }

  function isActiveExercise(exerciseId: string) {
    return route.query.exercise === exerciseId
  }

  function getCourseClasses(courseId: string) {
    const progress = getCourseProgress(courseId)
    const baseClasses = "w-full flex items-center justify-between p-4 rounded-lg"
    const activeClasses = "bg-emerald-100 dark:bg-emerald-900/50"
    const inactiveClasses = "hover:bg-gray-50 dark:hover:bg-gray-700"
    const progressClasses =
      progress === 100
        ? "border-l-4 border-green-500"
        : progress > 0
          ? "border-l-4 border-blue-500"
          : "border-l-4 border-gray-300"

    return `${baseClasses} ${isActiveCourse(courseId) ? activeClasses : inactiveClasses} ${progressClasses}`
  }

  function getLessonClasses(lessonId: string) {
    const baseClasses = "w-full text-left p-2 rounded"
    const activeClasses = "bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100"
    const inactiveClasses = "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"

    return `${baseClasses} ${isActiveLesson(lessonId) ? activeClasses : inactiveClasses}`
  }

  // Exercise management
  async function handleAnswerSubmit(answer: any) {
    if (!currentExercise.value) return false
    const courseId = route.query.course as string
    const lessonId = route.query.lesson as string

    try {
      console.log("Submitting answer:", {
        course: courseId,
        lesson: lessonId,
        exercise: currentExercise.value.id,
        answer
      })

      const result = await courseStore.submitExerciseAttempt(courseId, lessonId, currentExercise.value.id, answer)

      if (!result) {
        throw new Error("result is undefined")
      }

      if (result.isCorrect) {
        // Update lesson progress
        await courseStore.updateLessonProgress(courseId, lessonId, "completed")

        // Force refresh of course progress
        await courseStore.fetchCourseProgress(courseId)

        // Force refresh of current lesson progress
        await courseStore.fetchLessonProgress(courseId, lessonId)
      }

      return result.isCorrect
    } catch (error) {
      console.error("Error submitting answer:", error)
      return false
    }
  }

  // composables/useLearn.js

  async function handleNextExercise() {
    const courseId = route.query.course as string
    const lessonId = route.query.lesson as string
    if (!currentExercise.value?.id) {
      console.error("Current exercise does not exist")
      return
    }
    const nextExercise = await courseStore.nextExercise(courseId, lessonId, currentExercise.value?.id)

    if (nextExercise) {
      // If there's another exercise in this lesson, show it
      currentExercise.value = null
      await nextTick()
      currentExercise.value = nextExercise
    } else {
      try {
        // Mark current lesson as completed
        await courseStore.updateLessonProgress(courseId, lessonId, "completed")

        // Update course progress in store
        await courseStore.fetchCourseProgress(courseId)

        // Find the next lesson
        const lessons = currentCourse.value?.lessons || []
        const currentLessonIndex = lessons.findIndex(lesson => lesson.id === route.query.lesson)

        // Check if there's a next lesson
        if (currentLessonIndex !== -1 && currentLessonIndex < lessons.length - 1) {
          const nextLesson = lessons[currentLessonIndex + 1]

          // Immediately navigate to next lesson since current lesson is completed
          await selectLesson(courseId, nextLesson.id)

          if (!currentLesson.value) {
            throw new Error("current lesson does not exist")
          }

          // Reset exercise state for new lesson
          if (currentLesson.value?.exercises?.length > 0) {
            currentExercise.value = currentLesson.value.exercises[0]
          }
        }
      } catch (error) {
        console.error("Error handling next exercise:", error)
      }
    }
  }

  async function refreshCourseProgress(courseId: string) {
    try {
      // Fetch overall course progress
      await courseStore.fetchCourseProgress(courseId)

      // Fetch progress for current lesson if one is selected
      if (route.query.lesson) {
        await courseStore.fetchLessonProgress(courseId, route.query.lesson as string)
      }
    } catch (error) {
      console.error("Error refreshing course progress:", error)
    }
  }

  async function selectLesson(courseId: string, lessonId: string) {
    console.log("Selecting lesson:", { courseId, lessonId })

    try {
      await courseStore.fetchLesson(courseId, lessonId)
      expandedCourseId.value = courseId
      expandedLessonId.value = lessonId

      await router.push({
        path: "/learn",
        query: {
          course: courseId,
          lesson: lessonId
        }
      })

      updateCurrentExercise()
    } catch (error) {
      console.error("Error selecting lesson:", error)
    }
  }

  function updateCurrentExercise() {
    if (!currentLesson.value) {
      console.error("current lesson does not exist")
      return
    }
    if (currentLesson.value?.exercises?.length > 0) {
      currentExercise.value = currentLesson.value.exercises[0]
    }
  }

  async function initialize() {
    const courseId = route.query.course as string
    const lessonId = route.query.lesson as string

    try {
      await courseStore.fetchCourses()

      if (courseId != "") {
        await courseStore.fetchCourse(courseId)
        expandedCourseId.value = courseId

        // Load course progress
        await courseStore.fetchCourseProgress(courseId)

        if (route.query.lesson) {
          await courseStore.fetchLesson(courseId, lessonId)
          await courseStore.fetchLessonProgress(courseId, lessonId)
          expandedLessonId.value = lessonId
          updateCurrentExercise()
        }
      }
    } catch (error) {
      console.error("Error initializing:", error)
    }
  }

  return {
    // State
    sidebarOpen,
    expandedCourseId,
    expandedLessonId,
    currentExercise,
    courseStore,
    currentCourse,
    currentLesson,

    // Navigation
    getSidebarContainerClasses,
    getSidebarContentClasses,
    toggleSidebar,
    toggleCourse,
    toggleLesson,

    // Progress
    getCourseProgress,
    canAccessLesson,
    getLessonsForCourse,

    // UI
    isActiveCourse,
    isActiveLesson,
    isActiveExercise,
    getCourseClasses,
    getLessonClasses,

    // Exercise Management
    handleAnswerSubmit,
    handleNextExercise,
    selectLesson,
    updateCurrentExercise,

    // Initialization
    initialize
  }
}
