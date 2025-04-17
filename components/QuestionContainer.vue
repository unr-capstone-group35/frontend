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
const displayedTotalPoints = ref(0) // Add this to track displayed points

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
    await pointsStore.fetchPointsSummary() // Add this to fetch total points
    displayedTotalPoints.value = pointsStore.totalPoints // Initialize displayed points
  }
})

const canSubmit = computed(() => {
  // For ordering type, we should always be able to check the answer
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
        currentStreak.value = lessonPoints.currentStreak
      }
    }
  },
  { deep: true }
)

// Add a watcher for total points
watch(
  () => pointsStore.summary,
  () => {
    if (pointsStore.summary) {
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

  try {
    // Use the updated submission method that returns points info
    const result = await props.onSubmitAnswer(selectedAnswer.value)
    console.log("Question Container - Submission result:", result)
    
    // The result might now be an object with isCorrect and points
    if (typeof result === 'object' && result !== null) {
      isCorrect.value = result.isCorrect
      if (result.points) {
        pointsAwarded.value = result.points
      }
      if (result.currentStreak) {
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
      await pointsStore.fetchPointsSummary() // Add this to refresh total points
      displayedTotalPoints.value = pointsStore.totalPoints // Update displayed points
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

  // Reset the current exercise state in the store
  exerciseStore.resetCurrentExercise()
}
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <!-- Points and Streak Display -->
    <div v-if="courseId && lessonId" class="mb-4 flex justify-between">
      <div class="rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-800">
        <span class="text-sm font-medium text-gray-800 dark:text-gray-200">Streak: </span>
        <span class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ currentStreak }}</span>
      </div>
      <div class="rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-800">
        <span class="text-sm font-medium text-gray-800 dark:text-gray-200">Total Points: </span>
        <span class="text-lg font-bold text-emerald-600 dark:text-emerald-400">
          {{ displayedTotalPoints }}
        </span>
      </div>
    </div>

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

    <!-- Bottom Row: Feedback and Buttons -->
    <div class="mt-6 flex items-center justify-between">
      <!-- Feedback Message (if any) -->
      <div v-if="showFeedback" class="flex-grow">
        <div
          :class="[
            'inline-block rounded-lg p-4',
            isCorrect
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
          ]"
        >
          <div>{{ isCorrect ? "Correct!" : "Try again!" }}</div>
          <!-- Points Information -->
          <div v-if="isCorrect && pointsAwarded > 0" class="mt-1 text-sm font-medium">
            +{{ pointsAwarded }} points
            <span v-if="currentStreak > 1" class="ml-2">
              ({{ currentStreak }}x streak!)
            </span>
          </div>
        </div>
      </div>
      <div v-else class="flex-grow">
        <!-- Empty space holder when no feedback -->
      </div>

      <!-- Buttons -->
      <div class="flex gap-4">
        <!-- Check Answer/Try Again Button -->
        <button
          v-if="!isCorrect"
          @click="handleMainButton"
          class="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
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
              : 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
          ]"
          :disabled="!isCorrect"
        >
          Next Exercise
        </button>
      </div>
    </div>
  </div>
</template>