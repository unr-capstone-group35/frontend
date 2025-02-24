<!-- components/QuestionContainer.vue -->
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
          {{ isCorrect ? "Correct!" : "Try again!" }}
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

<script setup>
import { ref, computed, watch } from "vue"
import MultipleChoice from "./questions/MultipleChoice.vue"
import TrueFalse from "./questions/TrueFalse.vue"
import FillBlank from "./questions/FillBlank.vue"
import Ordering from "./questions/Ordering.vue"
import Matching from "./questions/Matching.vue"

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

const isCorrect = ref(false)
const showFeedback = ref(false)
const selectedAnswer = ref(null)

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
  },
  { immediate: true }
)

const questionComponent = computed(() => {
  switch (props.exercise.type) {
    case "multiple_choice":
      return MultipleChoice
    case "true_false":
      return TrueFalse
    case "fill_blank":
      return FillBlank
    case "ordering":
      return Ordering
    case "matching":
      return Matching
    default:
      return null
  }
})

function updateAnswer(answer) {
  console.log("Question Container - Answer updated:", answer)
  selectedAnswer.value = answer
  showFeedback.value = false
  isCorrect.value = false // Reset correctness state
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
  if (selectedAnswer.value === null && props.exercise.type !== "ordering")
    return

  console.log("Question Container - Submitting answer:", selectedAnswer.value)
  showFeedback.value = false // Reset feedback before new submission

  try {
    const result = await props.onSubmitAnswer(selectedAnswer.value)
    console.log("Question Container - Submission result:", result)
    isCorrect.value = result
    showFeedback.value = true
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
}
</script>
