<!-- components/questions/MultipleChoice.vue -->
<template>
    <div class="space-y-6">
      <h3 class="text-xl font-medium text-gray-900 dark:text-white">
        {{ exercise.question }}
      </h3>
      
      <div class="space-y-3">
        <button
          v-for="(choice, index) in exercise.choices"
          :key="index"
          @click="selectAnswer(index)"
          :disabled="showFeedback"
          :class="[
            'w-full p-4 text-left rounded-lg transition-colors',
            getChoiceClasses(index)
          ]"
        >
          {{ choice }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const props = defineProps({
    exercise: {
      type: Object,
      required: true
    },
    showFeedback: Boolean,
    isCorrect: Boolean
  })
  
  const emit = defineEmits(['answer-submitted'])
  const selectedAnswer = ref(null)
  
  function selectAnswer(index) {
    selectedAnswer.value = index
    emit('answer-submitted', index === props.exercise.correctAnswer)
  }
  
  function getChoiceClasses(index) {
    if (!props.showFeedback) {
      return 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
    }
    
    if (index === props.exercise.correctAnswer) {
      return 'bg-green-100 dark:bg-green-900 border-green-500'
    }
    
    if (index === selectedAnswer.value && !props.isCorrect) {
      return 'bg-red-100 dark:bg-red-900 border-red-500'
    }
    
    return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-50'
  }
  </script>