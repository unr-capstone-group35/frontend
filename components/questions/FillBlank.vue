<!-- components/questions/FillBlank.vue -->
<template>
    <div class="space-y-6">
      <h3 class="text-xl font-medium text-gray-900 dark:text-white">
        {{ formatQuestion }}
      </h3>
      
      <div class="max-w-xs mx-auto">
        <input
          type="text"
          v-model="answer"
          :disabled="showFeedback"
          @keyup.enter="submitAnswer"
          :class="[
            'w-full p-3 rounded-lg border focus:ring-2 focus:ring-emerald-500 outline-none',
            getInputClasses()
          ]"
          placeholder="Type your answer..."
        />
      </div>
      
      <button
        v-if="!showFeedback"
        @click="submitAnswer"
        class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
      >
        Submit Answer
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  const props = defineProps({
    exercise: {
      type: Object,
      required: true
    },
    showFeedback: Boolean,
    isCorrect: Boolean
  })
  
  const emit = defineEmits(['answer-submitted'])
  const answer = ref('')
  
  const formatQuestion = computed(() => {
    return props.exercise.question.replace('__', '_____')
  })
  
  function submitAnswer() {
    if (!answer.value) return
    emit('answer-submitted', answer.value.trim().toLowerCase() === props.exercise.correctAnswer.toLowerCase())
  }
  
  function getInputClasses() {
    if (!props.showFeedback) {
      return 'border-gray-200 dark:border-gray-700 dark:bg-gray-800'
    }
    
    return props.isCorrect 
      ? 'border-green-500 bg-green-50 dark:bg-green-900'
      : 'border-red-500 bg-red-50 dark:bg-red-900'
  }
  </script>