// composables/useLearn.ts

export function useLearn() {
  const router = useRouter();
  const route = useRoute();

  // Stores - only initialize inside the composable function
  const courseStore = useCourseStore();
  const lessonStore = useLessonStore();
  const exerciseStore = useExerciseStore();
  const progressStore = useProgressStore();
  const pointsStore = usePointsStore();

  // Use storeToRefs to maintain reactivity
  const { currentCourse } = storeToRefs(courseStore);
  const { currentLesson } = storeToRefs(lessonStore);
  const { currentExercise, isCorrect } = storeToRefs(exerciseStore);

  // Navigation state - define inside the composable
  const sidebarOpen = ref<boolean>(true);
  const expandedCourseId = ref<string>("");
  const expandedLessonId = ref<string>("");

  // Navigation methods
  function getSidebarContainerClasses() {
    return !sidebarOpen.value ? "w-8" : "w-80";
  }

  function getSidebarContentClasses() {
    return sidebarOpen.value ? "w-80" : "w-0";
  }

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value;
  }

  // Course expansion handler
  async function toggleCourse(courseId: string) {
    if (expandedCourseId.value === courseId) {
      expandedCourseId.value = "";
    } else {
      expandedCourseId.value = courseId;
      expandedLessonId.value = "";

      // Load course data if not already loaded
      if (expandedCourseId.value !== "") {
        await courseStore.fetchCourse(courseId);
      }
    }
  }

  // Lesson expansion handler
  function toggleLesson(lessonId: string) {
    expandedLessonId.value = expandedLessonId.value === lessonId ? "" : lessonId;
  }

  // UI state
  function isActiveCourse(courseId: string) {
    return route.query.course === courseId;
  }

  function isActiveLesson(lessonId: string) {
    return route.query.lesson === lessonId;
  }

  function isActiveExercise(exerciseId: string) {
    return currentExercise.value?.id === exerciseId;
  }

  // CSS class helpers
  function getCourseClasses(courseId: string) {
    const progress = courseStore.calculateCourseProgress(courseId);
    const baseClasses = "w-full flex items-center justify-between p-4 rounded-lg";
    const activeClasses = "bg-emerald-100 dark:bg-emerald-900/50";
    const inactiveClasses = "hover:bg-gray-50 dark:hover:bg-gray-700";
    const progressClasses =
      progress === 100
        ? "border-l-4 border-green-500"
        : progress > 0
          ? "border-l-4 border-blue-500"
          : "border-l-4 border-gray-300";

    return `${baseClasses} ${isActiveCourse(courseId) ? activeClasses : inactiveClasses} ${progressClasses}`;
  }

  function getLessonClasses(lessonId: string) {
    const baseClasses = "w-full text-left p-2 rounded";
    const activeClasses = "bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100";
    const inactiveClasses = "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300";

    return `${baseClasses} ${isActiveLesson(lessonId) ? activeClasses : inactiveClasses}`;
  }

  // Helper to update current exercise - with better error handling
  function updateCurrentExercise() {
    if (!currentLesson.value) {
      console.log("Waiting for lesson data to load...");
      return;
    }

    if (currentLesson.value.exercises?.length > 0) {
      exerciseStore.setCurrentExercise(currentLesson.value.exercises[0].id);
    } else {
      console.log("No exercises found in current lesson");
    }
  }

  // Exercise management
  async function handleAnswerSubmit(answer: any) {
    if (!currentExercise.value) return false;

    try {
      const courseId = route.query.course as string;
      const lessonId = route.query.lesson as string;
      const exerciseId = currentExercise.value.id;

      // Use the points-enabled endpoint for exercise attempts
      const result = await pointsStore.submitExerciseAttempt(courseId, lessonId, exerciseId, answer);

      if (!result) return false;

      // Store the answer in the exercise store for history
      const key = `${courseId}-${lessonId}-${exerciseId}`;
      exerciseStore.previousAnswers[key] = answer;
      exerciseStore.submissionResults[key] = result.isCorrect;

      return result;
    } catch (error) {
      console.error("Error submitting answer:", error);
      return false;
    }
  }

  // Lesson completion handler
  async function handleLessonCompletion(courseId: string, lessonId: string) {
    try {
      // Mark lesson as completed in progress store
      await lessonStore.markLessonCompleted(courseId, lessonId);

      // Award points for lesson completion
      await pointsStore.completeLesson(courseId, lessonId);

      return true;
    } catch (error) {
      console.error("Error completing lesson:", error);
      return false;
    }
  }

  // Next exercise handler
  async function handleNextExercise() {
    const courseId = route.query.course as string;
    const lessonId = route.query.lesson as string;

    if (!currentExercise.value?.id) {
      console.error("Current exercise does not exist");
      return;
    }

    // Try to get the next exercise in the current lesson
    const nextExercise = await exerciseStore.nextExercise();

    if (nextExercise) {
      // If there's another exercise in this lesson, show it
      return nextExercise;
    } else {
      try {
        // Handle lesson completion with points
        await handleLessonCompletion(courseId, lessonId);

        // Find the next lesson
        const nextLesson = courseStore.getNextLesson(lessonId);

        // If there's a next lesson, navigate to it
        if (nextLesson) {
          await selectLesson(courseId, nextLesson.id);

          // After selecting a lesson, wait for the next tick
          // to ensure currentLesson is updated
          await nextTick();

          // Now we can safely work with currentLesson
          const lesson = currentLesson.value;
          if (lesson && lesson.exercises && lesson.exercises.length > 0) {
            exerciseStore.setCurrentExercise(lesson.exercises[0].id);
          }
        } else {
          // No next lesson, we've completed the course
          console.log("Course completed!");
          // Award points for course completion
          await pointsStore.completeCourse(courseId);
          // Could navigate to a completion screen or dashboard
        }
      } catch (error) {
        console.error("Error handling next exercise:", error);
      }
    }
  }

  // Lesson selection handler
  async function selectLesson(courseId: string, lessonId: string) {
    console.log("Selecting lesson:", { courseId, lessonId });

    try {
      // Fetch lesson data
      await lessonStore.fetchLesson(courseId, lessonId);

      // Update UI state
      expandedCourseId.value = courseId;
      expandedLessonId.value = lessonId;

      // Update route
      await router.push({
        path: "/learn",
        query: {
          course: courseId,
          lesson: lessonId,
        },
      });

      // Mark lesson as in progress if it's not already completed
      const status = lessonStore.getLessonStatus(courseId, lessonId);
      if (status === "not_started") {
        await lessonStore.markLessonInProgress(courseId, lessonId);
      }

      // Set the first exercise as current - only if lesson data is loaded
      if (currentLesson.value) {
        updateCurrentExercise();
      }

      // Load lesson points data
      await pointsStore.fetchLessonPoints(courseId, lessonId);

      return true;
    } catch (error) {
      console.error("Error selecting lesson:", error);
      return false;
    }
  }

  // Initialization - with better async handling
  async function initialize() {
    const courseId = route.query.course as string;
    const lessonId = route.query.lesson as string;
    const exerciseId = route.query.exercise as string;

    try {
      // Load all courses
      await courseStore.fetchCourses();

      // Load points summary
      await pointsStore.fetchPointsSummary();

      // If course ID is provided in the route
      if (courseId) {
        // Load the course
        await courseStore.fetchCourse(courseId);
        expandedCourseId.value = courseId;

        // If lesson ID is provided in the route
        if (lessonId) {
          // Load the lesson and wait for it to complete
          console.log(`Requesting lesson ${lessonId} from course ${courseId}`);
          await lessonStore.fetchLesson(courseId, lessonId);

          // Ensure we have the lesson data before proceeding
          await nextTick();

          expandedLessonId.value = lessonId;

          // Load lesson points
          await pointsStore.fetchLessonPoints(courseId, lessonId);

          // If exercise ID is provided in the route, set it as current
          if (exerciseId && currentLesson.value) {
            const exerciseExists = currentLesson.value.exercises.some((ex) => ex.id === exerciseId);
            if (exerciseExists) {
              exerciseStore.setCurrentExercise(exerciseId);
            } else if (currentLesson.value) {
              // Only update if lesson data is available
              updateCurrentExercise();
            }
          } else if (currentLesson.value) {
            // Only update if lesson data is available
            updateCurrentExercise();
          }
        }
      }
    } catch (error) {
      console.error("Error initializing:", error);
    }
  }

  let watchInitialized = false;

  watch(
    () => currentLesson.value,
    (newLesson) => {
      if (newLesson && !watchInitialized) {
        watchInitialized = true;
        updateCurrentExercise();
      }
    },
  );

  watch(
    () => route.query,
    async (newQuery) => {
      const courseId = newQuery.course as string;
      const lessonId = newQuery.lesson as string;

      if (courseId && lessonId) {
        if (!currentLesson.value || currentLesson.value.id !== lessonId) {
          try {
            // Load lesson data before updating current exercise
            await lessonStore.fetchLesson(courseId, lessonId);
            await nextTick();

            // Only update if lesson data is available
            if (currentLesson.value) {
              updateCurrentExercise();
            }
          } catch (error) {
            console.error("Error loading lesson data:", error);
          }
        }
      }
    },
    { deep: true },
  );

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
    pointsStore,

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
      return courseStore.courses[courseId]?.lessons || [];
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
    handleLessonCompletion,
    selectLesson,
    updateCurrentExercise,

    // Initialization
    initialize,
  };
}
