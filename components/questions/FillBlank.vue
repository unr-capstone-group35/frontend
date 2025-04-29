<script setup lang="ts">
import { ref, computed, watch } from "vue";

const props = defineProps({
  exercise: {
    type: Object,
    required: true,
  },
  selectedAnswer: {
    type: [String, null],
    default: null,
  },
  showFeedback: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update-answer"]);

const localAnswer = ref("");

watch(
  () => props.selectedAnswer,
  (newVal) => {
    if (newVal === null) {
      localAnswer.value = "";
    } else {
      localAnswer.value = newVal;
    }
  },
  { immediate: true },
);

// Find the text before and after the blank
const codeParts = computed(() => {
  // Get the part after "write:"
  const promptParts = props.exercise.question.split("write:");
  const questionWithoutPrompt = promptParts.length > 1 ? promptParts[1].trim() : props.exercise.question;

  // Special case for function syntax where the blank is usually at the beginning, we should def just change the question setup instead
  if (questionWithoutPrompt.includes("greet()") || questionWithoutPrompt.includes("function")) {
    const match = questionWithoutPrompt.match(/(.*)(_+)(.*)/);
    if (match) {
      return {
        before: "",
        after: questionWithoutPrompt.replace(/_/g, ""),
      };
    }
  }

  // Check for placeholders like "_" or "$BLANK$" or similar
  const parts = questionWithoutPrompt.split(/[_$]/);
  const cleanParts = parts.filter((part: string) => part && part !== "BLANK");

  // Position of underscore determines position of input field
  const hasLeadingUnderscore = questionWithoutPrompt.trim().startsWith("_");

  // If underscore is at the beginning or we couldn't find parts, special case
  if (hasLeadingUnderscore || cleanParts.length < 2) {
    return {
      before: "",
      after: hasLeadingUnderscore ? questionWithoutPrompt.replace(/_/g, "").trim() : questionWithoutPrompt.trim(),
    };
  }

  return {
    before: cleanParts[0].trim(),
    after: cleanParts[1].trim(),
  };
});

// Get input width based on correct answer length
const inputWidth = computed(() => {
  if (props.exercise.correctAnswer) {
    // Estimate width based on answer length (min 60px, max 200px)
    const length = props.exercise.correctAnswer.length;
    return Math.max(60, Math.min(200, length * 16)) + "px";
  }
  return "80px"; // Default width
});

function handleInput(event: any) {
  const value = event.target.value;
  localAnswer.value = value;
  emit("update-answer", value);
}

const isCorrect = computed(() => {
  if (!props.exercise.correctAnswer) return false;
  return localAnswer.value.toLowerCase() === props.exercise.correctAnswer.toLowerCase();
});
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 v-if="exercise.title" class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        {{ exercise.title }}
      </h2>
      <p v-if="exercise.description" class="text-gray-600 dark:text-gray-300">
        {{ exercise.description }}
      </p>
    </div>

    <div class="mt-6">
      <h3 class="text-xl font-medium text-gray-900 dark:text-white">
        {{ props.exercise.question.split("write:")[0] }} write:
      </h3>

      <!-- Code part with single input field -->
      <div class="ml-8 mt-4 flex items-center">
        <div class="flex items-center space-x-2 font-mono text-xl text-white">
          <span v-if="codeParts.before">{{ codeParts.before }}</span>

          <!-- Single input box -->
          <input
            type="text"
            v-model="localAnswer"
            @input="handleInput"
            :disabled="showFeedback"
            :style="{ width: inputWidth }"
            class="inline-block rounded border px-2 py-1 text-center font-mono outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            :class="{
              'border-green-500 bg-green-50 dark:bg-green-900/20': showFeedback && isCorrect,
              'border-red-500 bg-red-50 dark:bg-red-900/20': showFeedback && !isCorrect,
              'border-gray-300': !showFeedback,
            }"
          />

          <span v-if="codeParts.after">{{ codeParts.after.replace(/_/g, "") }}</span>
        </div>
      </div>

      <div v-if="showFeedback" class="mt-4">
        <div
          v-if="isCorrect"
          class="rounded-md bg-green-100 p-3 text-green-800 dark:bg-green-900/20 dark:text-green-200"
        >
          <p class="font-semibold">Correct!</p>
          <p v-if="exercise.explanation">{{ exercise.explanation }}</p>
        </div>
        <div v-else class="rounded-md bg-red-100 p-3 text-red-800 dark:bg-red-900/20 dark:text-red-200">
          <p class="font-semibold">Try again</p>
        </div>
      </div>
    </div>
  </div>
</template>
