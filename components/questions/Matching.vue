<template>
  <div class="space-y-6">
    <h3 class="text-xl font-medium text-gray-900 dark:text-white">
      {{ exercise.question }}
    </h3>

    <div class="grid gap-6 md:grid-cols-2">
      <!-- Left column: Terms -->
      <div class="space-y-3">
        <div
          v-for="(term, index) in randomizedTerms"
          :key="`term-${term.originalIndex}`"
          class="rounded-lg border p-4 transition-all duration-200"
          :class="{
            'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800':
              !selectedTerm || selectedTerm !== term.originalIndex,
            'border-blue-500 bg-blue-100 dark:border-blue-400 dark:bg-blue-800': selectedTerm === term.originalIndex,
            'opacity-50': isMatched(term.originalIndex, 'term'),
            'cursor-pointer': !isMatched(term.originalIndex, 'term')
          }"
          @click="selectTerm(term.originalIndex)"
        >
          <span
            :class="{
              'text-gray-900 dark:text-white': !selectedTerm || selectedTerm !== term.originalIndex,
              'text-blue-800 dark:text-blue-100': selectedTerm === term.originalIndex
            }"
            >{{ term.text }}</span
          >
        </div>
      </div>

      <!-- Right column: Definitions -->
      <div class="space-y-3">
        <div
          v-for="(def, index) in randomizedDefinitions"
          :key="`def-${def.originalIndex}`"
          class="rounded-lg border p-4 transition-all duration-200"
          :class="{
            'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800':
              !selectedDefinition || selectedDefinition !== def.originalIndex,
            'border-blue-500 bg-blue-100 dark:border-blue-400 dark:bg-blue-800':
              selectedDefinition === def.originalIndex,
            'opacity-50': isMatched(def.originalIndex, 'definition'),
            'cursor-pointer': !isMatched(def.originalIndex, 'definition')
          }"
          @click="selectDefinition(def.originalIndex)"
        >
          <span
            :class="{
              'text-gray-900 dark:text-white': !selectedDefinition || selectedDefinition !== def.originalIndex,
              'text-blue-800 dark:text-blue-100': selectedDefinition === def.originalIndex
            }"
            >{{ def.text }}</span
          >
        </div>
      </div>
    </div>

    <!-- Show current matches with delete buttons -->
    <div v-if="currentMatches.length > 0" class="mt-4">
      <h4 class="mb-2 font-medium text-gray-900 dark:text-white">Current Matches:</h4>
      <div class="space-y-2">
        <div
          v-for="(match, index) in currentMatches"
          :key="index"
          class="flex items-center justify-between rounded bg-gray-50 p-2 text-gray-900 dark:bg-gray-700 dark:text-white"
        >
          <span> {{ getTermText(match[0]) }} ↔ {{ getDefinitionText(match[1]) }} </span>
          <button
            @click="deleteMatch(index)"
            class="ml-2 p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            <span class="sr-only">Delete match</span>
            ✕
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue"

const props = defineProps({
  exercise: {
    type: Object,
    required: true
  },
  selectedAnswer: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(["update-answer"])

const selectedTerm = ref(null)
const selectedDefinition = ref(null)
const currentMatches = ref([])
const randomizedTerms = ref([])
const randomizedDefinitions = ref([])

function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function initializeRandomization() {
  const indices = Array.from({ length: props.exercise.pairs.length }, (_, i) => i)

  const termIndices = shuffleArray(indices)
  randomizedTerms.value = termIndices.map(originalIndex => ({
    text: props.exercise.pairs[originalIndex][0],
    originalIndex
  }))

  const defIndices = shuffleArray(indices)
  randomizedDefinitions.value = defIndices.map(originalIndex => ({
    text: props.exercise.pairs[originalIndex][1],
    originalIndex
  }))
}

function getTermText(index) {
  const term = randomizedTerms.value.find(t => t.originalIndex === index)
  return term ? term.text : ""
}

function getDefinitionText(index) {
  const def = randomizedDefinitions.value.find(d => d.originalIndex === index)
  return def ? def.text : ""
}

function deleteMatch(index) {
  currentMatches.value.splice(index, 1)
  updateAnswer()
}

function clearAllMatches() {
  currentMatches.value = []
  selectedTerm.value = null
  selectedDefinition.value = null
  updateAnswer()
}

// Update answer whenever matches change
function updateAnswer() {
  if (currentMatches.value.length === props.exercise.pairs.length) {
    const formattedAnswer = currentMatches.value.map(match => {
      const term = String(props.exercise.pairs[match[0]][0])
      const definition = String(props.exercise.pairs[match[1]][1])
      return [term, definition]
    })
    emit("update-answer", formattedAnswer)
  } else {
    emit("update-answer", null)
  }
}

onMounted(() => {
  initializeRandomization()
})

watch(
  () => props.exercise,
  () => {
    clearAllMatches()
    initializeRandomization()
  },
  { immediate: true }
)

// clear all matches when selected answer becomes null from question container
watch(
  () => props.selectedAnswer,
  (newValue, oldValue) => {
    if (newValue == null && oldValue != null) {
      clearAllMatches()
    }
  }
)

function isMatched(index, type) {
  if (type === "term") {
    return currentMatches.value.some(match => match[0] === index)
  }
  return currentMatches.value.some(match => match[1] === index)
}

function selectTerm(index) {
  if (isMatched(index, "term")) return
  selectedTerm.value = index
  tryMatch()
}

function selectDefinition(index) {
  if (isMatched(index, "definition")) return
  selectedDefinition.value = index
  tryMatch()
}

function tryMatch() {
  if (selectedTerm.value !== null && selectedDefinition.value !== null) {
    currentMatches.value.push([selectedTerm.value, selectedDefinition.value])
    selectedTerm.value = null
    selectedDefinition.value = null
    updateAnswer()
  }
}
</script>
