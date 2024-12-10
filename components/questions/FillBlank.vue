<!-- components/questions/FillBlank.vue -->
<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
        {{ exercise.title }}
      </h2>
      <p class="text-gray-600 dark:text-gray-300">
        {{ exercise.description }}
      </p>
    </div>

    <div class="mt-6">
      <h3 class="text-xl font-medium text-gray-900 dark:text-white">
        {{ formatQuestion }}
      </h3>
      
      <div class="max-w-xs mt-4">
        <input
          type="text"
          v-model="localAnswer"
          @input="handleInput"
          class="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 
                 focus:ring-2 focus:ring-blue-500 outline-none
                 dark:bg-gray-800 dark:text-white"
          placeholder="Type your answer..."
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  exercise: {
    type: Object,
    required: true
  },
  selectedAnswer: {
    type: [String, null],
    default: null
  }
})

const emit = defineEmits(['update-answer'])

const localAnswer = ref('')

// Watch for external answer changes
watch(() => props.selectedAnswer, (newVal) => {
  if (newVal === null) {
    localAnswer.value = ''
  }
}, { immediate: true })

const formatQuestion = computed(() => {
  return props.exercise.question.replace('_', '_____')
})

function handleInput(event) {
  const value = event.target.value
  localAnswer.value = value
  emit('update-answer', value)
}
</script>