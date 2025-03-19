// composables/useLearn.ts

export function useLearn() {
  const router = useRouter()
  const route = useRoute()
  
  // Stores
  const courseStore = useCourseStore()
  const lessonStore = useLessonStore()
  const exerciseStore = useExerciseStore()
  const progressStore = useProgressStore()
  
  // Reactive references from stores
  const { currentCourse } = storeToRefs(courseStore)
  const { currentLesson } = storeToRefs(lessonStore)
  const { currentExercise, isCorrect } = storeToRefs(exerciseStore)

  // Navigation state
  const sidebarOpen = ref<boolean>(true)
  const expandedCourseId = ref<string>("")
  const expandedLessonId = ref<string>("")

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
    if (expandedCourseId.value === courseId) {
      expandedCourseId.value = ""
    } else {
      expandedCourseId.value = courseId
      expandedLessonId.value = ""
      
      // Load course data if not already loaded
      if (expandedCourseId.value !== "") {
        await courseStore.fetchCourse(courseId)
      }
    }
  }

  function toggleLesson(lessonId: string) {
    expandedLessonId.value = expandedLessonId.value === lessonId ? "" : lessonId
  }

  // UI state
  function isActiveCourse(courseId: string) {
    return route.query.course === courseId
  }

  function isActiveLesson(lessonId: string) {
    return route.query.lesson === lessonId
  }

  function isActiveExercise(exerciseId: string) {
    return currentExercise.value?.id === exerciseId
  }

  function getCourseClasses(courseId: string) {
    const progress = courseStore.calculateCourseProgress(courseId)
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
    
    try {
      return await exerciseStore.submitAnswer(answer)
    } catch (error) {
      console.error("Error submitting answer:", error)
      return false
    }
  }

  async function handleNextExercise() {
    const courseId = route.query.course as string
    const lessonId = route.query.lesson as string
    
    if (!currentExercise.value?.id) {
      console.error("Current exercise does not exist")
      return
    }
    
    // Try to get the next exercise in the current lesson
    const nextExercise = await exerciseStore.nextExercise()
    
    if (nextExercise) {
      // If there's another exercise in this lesson, show it
      return nextExercise
    } else {
      try {
        // Mark current lesson as completed
        await lessonStore.markLessonCompleted(courseId, lessonId)
        
        // Find the next lesson
        const nextLesson = courseStore.getNextLesson(lessonId)
        
        // If there's a next lesson, navigate to it
        if (nextLesson) {
          await selectLesson(courseId, nextLesson.id)
          
          // After selecting a lesson, wait for the next tick
          // to ensure currentLesson is updated
          await nextTick()
          
          // Now we can safely work with currentLesson
          const lesson = currentLesson.value
          if (lesson && lesson.exercises && lesson.exercises.length > 0) {
            exerciseStore.setCurrentExercise(lesson.exercises[0].id)
          }
        } else {
          // No next lesson, we've completed the course
          console.log("Course completed!")
          // Could navigate to a completion screen or dashboard
        }
      } catch (error) {
        console.error("Error handling next exercise:", error)
      }
    }
  }

  async function selectLesson(courseId: string, lessonId: string) {
    console.log("Selecting lesson:", { courseId, lessonId })

    try {
      // Fetch lesson data
      await lessonStore.fetchLesson(courseId, lessonId)
      
      // Update UI state
      expandedCourseId.value = courseId
      expandedLessonId.value = lessonId

      // Update route
      await router.push({
        path: "/learn",
        query: {
          course: courseId,
          lesson: lessonId
        }
      })

      // Mark lesson as in progress if it's not already completed
      const status = lessonStore.getLessonStatus(courseId, lessonId)
      if (status === 'not_started') {
        await lessonStore.markLessonInProgress(courseId, lessonId)
      }

      // Set the first exercise as current
      updateCurrentExercise()
      
      return true
    } catch (error) {
      console.error("Error selecting lesson:", error)
      return false
    }
  }

  function updateCurrentExercise() {
    if (!currentLesson.value) {
      console.error("Current lesson does not exist")
      return
    }
    
    if (currentLesson.value.exercises?.length > 0) {
      exerciseStore.setCurrentExercise(currentLesson.value.exercises[0].id)
    }
  }

  // Initialization
  async function initialize() {
    const courseId = route.query.course as string
    const lessonId = route.query.lesson as string
    const exerciseId = route.query.exercise as string

    try {
      // Load all courses
      await courseStore.fetchCourses()

      // If course ID is provided in the route
      if (courseId) {
        // Load the course
        await courseStore.fetchCourse(courseId)
        expandedCourseId.value = courseId

        // If lesson ID is provided in the route
        if (lessonId) {
          // Load the lesson
          await lessonStore.fetchLesson(courseId, lessonId)
          expandedLessonId.value = lessonId
          
          // If exercise ID is provided in the route, set it as current
          if (exerciseId && currentLesson.value) {
            const exerciseExists = currentLesson.value.exercises.some(ex => ex.id === exerciseId)
            if (exerciseExists) {
              exerciseStore.setCurrentExercise(exerciseId)
            } else {
              updateCurrentExercise() // Fall back to first exercise
            }
          } else {
            updateCurrentExercise() // No exercise specified, use first one
          }
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
    
    // Store references
    courseStore,
    lessonStore,
    exerciseStore,
    progressStore,
    
    // Reactive store properties
    currentCourse,
    currentLesson,
    currentExercise,
    isCorrect,

    // Navigation
    getSidebarContainerClasses,
    getSidebarContentClasses,
    toggleSidebar,
    toggleCourse,
    toggleLesson,

    // Progress
    getLessonStatus: lessonStore.getLessonStatus,
    calculateCourseProgress: courseStore.calculateCourseProgress,
    canAccessLesson: courseStore.canAccessLesson,
    isLessonCompleted: progressStore.isLessonCompleted,
    getLessonsForCourse: (courseId: string) => {
      return courseStore.courses[courseId]?.lessons || []
    },

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