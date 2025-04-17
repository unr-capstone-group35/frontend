<script setup lang="ts">
const props = defineProps({
  exercise: {
    type: Object,
    required: true
  },
  onSubmitAnswer: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(["next-exercise"])

const exerciseStore = useExerciseStore()
const pointsStore = usePointsStore()
const isCorrect = ref(false)
const showFeedback = ref(false)
const selectedAnswer = ref(null)
const pointsAwarded = ref(0)
const currentStreak = ref(0)
const previousStreak = ref(0)
const previousPoints = ref(0)
const displayedTotalPoints = ref(0)
const streakIncreased = ref(false)
const animateStreak = ref(false)
const animatePoints = ref(false)
const shakeStreak = ref(false)

// Get the course and lesson IDs
const route = useRoute()
const courseId = computed(() => route.query.course as string)
const lessonId = computed(() => route.query.lesson as string)

// Get streak information
const lessonStreak = computed(() => {
  if (!courseId.value || !lessonId.value) return 0
  return pointsStore.getLessonStreak(courseId.value, lessonId.value)
})

// Load points data
onMounted(async () => {
  if (courseId.value && lessonId.value) {
    await pointsStore.fetchLessonPoints(courseId.value, lessonId.value)
    await pointsStore.fetchPointsSummary()
    displayedTotalPoints.value = pointsStore.totalPoints
    previousPoints.value = displayedTotalPoints.value
    previousStreak.value = currentStreak.value
  }
})

const canSubmit = computed(() => {
  if (props.exercise.type === "ordering") {
    return true
  }
  return selectedAnswer.value !== null
})

// Reset state when exercise changes
watch(
  () => props.exercise,
  () => {
    isCorrect.value = false
    showFeedback.value = false
    selectedAnswer.value = null
    pointsAwarded.value = 0
    streakIncreased.value = false
    animateStreak.value = false
    animatePoints.value = false
    shakeStreak.value = false
  },
  { immediate: true }
)

// Watch for lesson points changes
watch(
  () => pointsStore.lessonPoints,
  () => {
    if (courseId.value && lessonId.value) {
      const key = `${courseId.value}-${lessonId.value}`
      const lessonPoints = pointsStore.lessonPoints[key]
      if (lessonPoints) {
        // Check if streak increased
        if (lessonPoints.currentStreak > previousStreak.value) {
          streakIncreased.value = true
          animateStreak.value = true
          setTimeout(() => {
            animateStreak.value = false
          }, 1500)
        }

        // Check if streak was reset to 0 (was > 0 before and now is 0)
        if (previousStreak.value > 0 && lessonPoints.currentStreak === 0) {
          shakeStreak.value = true
          setTimeout(() => {
            shakeStreak.value = false
          }, 820) // Animation duration + buffer
        }

        previousStreak.value = currentStreak.value
        currentStreak.value = lessonPoints.currentStreak
      }
    }
  },
  { deep: true }
)

// Watch for total points
watch(
  () => pointsStore.summary,
  () => {
    if (pointsStore.summary) {
      previousPoints.value = displayedTotalPoints.value
      displayedTotalPoints.value = pointsStore.totalPoints
    }
  },
  { deep: true }
)

const questionComponent = computed(() => {
  switch (props.exercise.type) {
    case "multiple_choice":
      return resolveComponent("questions/MultipleChoice")
    case "true_false":
      return resolveComponent("questions/TrueFalse")
    case "fill_blank":
      return resolveComponent("questions/FillBlank")
    case "ordering":
      return resolveComponent("questions/Ordering")
    case "matching":
      return resolveComponent("questions/Matching")
    default:
      return null
  }
})

function updateAnswer(answer: any) {
  console.log("Question Container - Answer updated:", answer)
  selectedAnswer.value = answer
  showFeedback.value = false
  isCorrect.value = false // Reset correctness state
  pointsAwarded.value = 0 // Reset points
  streakIncreased.value = false // Reset streak increased flag
  animateStreak.value = false
  animatePoints.value = false
  shakeStreak.value = false
}

async function handleMainButton() {
  if (showFeedback.value) {
    // Handle retry
    retryQuestion()
  } else {
    // Handle submit
    await submitAnswer()
  }
}

async function submitAnswer() {
  // For ordering, we should allow submission even if selectedAnswer is null
  if (selectedAnswer.value === null && props.exercise.type !== "ordering") return

  console.log("Question Container - Submitting answer:", selectedAnswer.value)
  showFeedback.value = false // Reset feedback before new submission
  streakIncreased.value = false // Reset streak increased flag
  animateStreak.value = false
  animatePoints.value = false
  shakeStreak.value = false

  try {
    // Use the updated submission method that returns points info
    const result = await props.onSubmitAnswer(selectedAnswer.value)
    console.log("Question Container - Submission result:", result)

    // The result might now be an object with isCorrect and points
    if (typeof result === "object" && result !== null) {
      isCorrect.value = result.isCorrect
      if (result.points) {
        pointsAwarded.value = result.points
      }
      if (result.currentStreak !== undefined) {
        if (result.currentStreak > previousStreak.value) {
          streakIncreased.value = true
        }

        if (previousStreak.value > 0 && result.currentStreak === 0) {
          shakeStreak.value = true
          setTimeout(() => {
            shakeStreak.value = false
          }, 820) // Animation duration + buffer
        }

        previousStreak.value = currentStreak.value
        currentStreak.value = result.currentStreak
      }
    } else {
      // Backward compatibility
      isCorrect.value = !!result
    }

    showFeedback.value = true

    // Refresh points data
    if (courseId.value && lessonId.value) {
      await pointsStore.fetchLessonPoints(courseId.value, lessonId.value)
      await pointsStore.fetchPointsSummary() // Refresh total points
      previousPoints.value = displayedTotalPoints.value
      displayedTotalPoints.value = pointsStore.totalPoints // Update displayed points

      // Trigger animations if correct
      if (isCorrect.value) {
        if (streakIncreased.value) {
          animateStreak.value = true
          setTimeout(() => {
            animateStreak.value = false
          }, 1500)
        }

        if (pointsAwarded.value > 0) {
          animatePoints.value = true
          setTimeout(() => {
            animatePoints.value = false
          }, 1500)
        }
      }
    }
  } catch (error) {
    console.error("Error submitting answer:", error)
    isCorrect.value = false
    showFeedback.value = true
  }
}

function handleNextExercise() {
  if (isCorrect.value) {
    emit("next-exercise")
  }
}

function retryQuestion() {
  showFeedback.value = false
  selectedAnswer.value = null
  pointsAwarded.value = 0
  streakIncreased.value = false
  animateStreak.value = false
  animatePoints.value = false
  shakeStreak.value = false

  // Reset the current exercise state in the store
  exerciseStore.resetCurrentExercise()
}
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <!-- Exercise Content -->
    <component
      :is="questionComponent"
      v-if="exercise"
      :exercise="exercise"
      :selectedAnswer="selectedAnswer"
      :showFeedback="showFeedback"
      :isCorrect="isCorrect"
      @update-answer="updateAnswer"
    />

    <!-- Bottom Row: Feedback, Stats and Buttons -->
    <div class="mt-6 flex items-center justify-between">
      <!-- Left Side: Points and Streak -->
      <div class="flex items-center space-x-4">
        <!-- Streak Display -->
        <div class="flex items-center rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-700">
          <div class="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3.5 w-3.5 text-blue-600 dark:text-blue-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Streak: </span>
          <span
            class="ml-1 font-bold text-blue-600 transition-all duration-300 dark:text-blue-300"
            :class="{
              'scale-150 text-blue-500 dark:text-blue-200': animateStreak,
              'shake-animation': shakeStreak
            }"
          >
            {{ currentStreak }}
            <span
              v-if="animateStreak && streakIncreased"
              class="animate-float-up absolute ml-0.5 text-xs text-blue-500 opacity-0 dark:text-blue-200"
            >
              +1
            </span>
          </span>
        </div>

        <!-- Points Display -->
        <div class="flex items-center rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-700">
          <div class="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              />
            </svg>
          </div>
          <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Points: </span>
          <span
            class="ml-1 font-bold text-emerald-600 transition-all duration-300 dark:text-emerald-300"
            :class="{ 'scale-150 text-emerald-500 dark:text-emerald-200': animatePoints }"
          >
            {{ displayedTotalPoints }}
            <span
              v-if="animatePoints && pointsAwarded > 0"
              class="animate-float-up absolute ml-0.5 text-xs text-emerald-500 opacity-0 dark:text-emerald-200"
            >
              +{{ pointsAwarded }}
            </span>
          </span>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex gap-4">
        <!-- Check Answer/Try Again Button -->
        <button
          v-if="!isCorrect"
          @click="handleMainButton"
          class="rounded-lg px-6 py-2 text-white transition-colors disabled:opacity-50"
          :class="[
            showFeedback
              ? 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800'
              : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
          ]"
          :disabled="!canSubmit"
        >
          {{ showFeedback ? "Try Again" : "Check Answer" }}
        </button>

        <!-- Next Exercise Button -->
        <button
          @click="handleNextExercise"
          class="rounded-lg px-6 py-2 transition-colors"
          :class="[
            isCorrect
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600'
              : 'cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
          ]"
          :disabled="!isCorrect"
        >
          Next Exercise
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-float-up {
  animation: float-up 1.5s forwards;
}

@keyframes float-up {
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateY(-20px);
    opacity: 0;
  }
}

.shake-animation {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-3px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(3px, 0, 0);
  }
}
</style>
