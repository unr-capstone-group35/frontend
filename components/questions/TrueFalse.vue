<!-- components/questions/TrueFalse.vue -->
<template>
    <div class="space-y-6">
      <h3 class="text-xl font-medium text-gray-900 dark:text-white">
        {{ exercise.question }}
      </h3>
      
      <div class="flex gap-4 justify-center">
        <button
          v-for="option in [true, false]"
          :key="option"
          @click="selectAnswer(option)"
          :disabled="showFeedback"
          :class="[
            'px-8 py-4 rounded-lg font-medium transition-colors',
            getOptionClasses(option)
          ]"
        >
          {{ option ? 'True' : 'False' }}
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
  
  function selectAnswer(answer) {
    selectedAnswer.value = answer
    emit('answer-submitted', answer === props.exercise.correctAnswer)
  }
  
  function getOptionClasses(option) {
    if (!props.showFeedback) {
      return 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
    }
    
    if (option === props.exercise.correctAnswer) {
      return 'bg-green-100 dark:bg-green-900 border-green-500'
    }
    
    if (option === selectedAnswer.value && !props.isCorrect) {
      return 'bg-red-100 dark:bg-red-900 border-red-500'
    }
    
    return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-50'
  }
  </script>