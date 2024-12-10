<template>
  <div class="space-y-6">
    <h3 class="text-xl font-medium text-gray-900 dark:text-white">
      {{ exercise.question }}
    </h3>
    
    <div class="space-y-3">
      <button
        v-for="(choice, index) in randomizedChoices"
        :key="choice.originalIndex"
        @click="selectAnswer(choice.originalIndex)"
        :class="[
          'w-full p-4 text-left rounded-lg transition-colors',
          getChoiceClasses(choice.originalIndex)
        ]"
      >
        {{ choice.text }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  exercise: {
    type: Object,
    required: true
  },
  selectedAnswer: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['update-answer'])
const randomizedChoices = ref([])

function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function initializeChoices() {
  randomizedChoices.value = shuffleArray(
    props.exercise.choices.map((text, index) => ({
      text,
      originalIndex: index
    }))
  )
}

watch(() => props.exercise, () => {
  initializeChoices()
}, { immediate: true })

onMounted(() => {
  initializeChoices()
})

function selectAnswer(index) {
  console.log('Selected answer:', index)
  emit('update-answer', index)
}
  
function getChoiceClasses(index) {
  const baseClasses = 'border transition-colors'
  const selectedClasses = props.selectedAnswer === index
    ? 'bg-blue-100 dark:bg-blue-900 border-blue-500'
    : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700'
  
  return `${baseClasses} ${selectedClasses}`
}
</script>