<!-- components/QuestionContainer.vue -->
<template>
    <div class="max-w-3xl mx-auto">
      <component 
        :is="questionComponent"
        v-if="exercise"
        :exercise="exercise"
        :isCorrect="isCorrect"
        :showFeedback="showFeedback"
        @answer-submitted="handleAnswer"
      />
      
      <div v-if="showFeedback" class="mt-6 text-center">
        <div :class="[
          'p-4 rounded-lg mb-4',
          isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        ]">
          {{ isCorrect ? 'Correct!' : 'Try again!' }}
        </div>
        
        <button
          v-if="isCorrect"
          @click="$emit('next-exercise')"
          class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Next Exercise
        </button>
        
        <button
          v-else
          @click="retryQuestion"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import MultipleChoice from './questions/MultipleChoice.vue'
  import TrueFalse from './questions/TrueFalse.vue'
  import FillBlank from './questions/FillBlank.vue'
  import Ordering from './questions/Ordering.vue'
  import Matching from './questions/Matching.vue'
  
  const props = defineProps({
    exercise: {
      type: Object,
      required: true
    }
  })
  
  const emit = defineEmits(['next-exercise'])
  
  const isCorrect = ref(false)
  const showFeedback = ref(false)
  
  const questionComponent = computed(() => {
    switch (props.exercise.type) {
      case 'multiple_choice':
        return MultipleChoice
      case 'true_false':
        return TrueFalse
      case 'fill_blank':
        return FillBlank
      case 'ordering':
        return Ordering
      case 'matching':
        return Matching
      default:
        return null
    }
  })
  
  function handleAnswer(correct) {
    isCorrect.value = correct
    showFeedback.value = true
  }
  
  function retryQuestion() {
    showFeedback.value = false
  }
  </script>