<template>
  <div class="space-y-6">
    <h3 class="text-xl font-medium text-gray-900 dark:text-white">
      {{ exercise.question }}
    </h3>
    
    <div class="space-y-3">
      <button
        v-for="(option, index) in [true, false]"
        :key="index"
        @click="selectAnswer(option)"
        :class="[
          'w-full p-4 text-left rounded-lg transition-all duration-200',
          getChoiceClasses(option)
        ]"
      >
        <span class="text-gray-900 dark:text-white">{{ option }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  exercise: {
    type: Object,
    required: true
  },
  selectedAnswer: {
    type: Boolean,
    default: null
  }
})

const emit = defineEmits(['update-answer'])

function selectAnswer(value) {
  emit('update-answer', value)
}

function getChoiceClasses(option) {
  const baseClasses = 'border transition-colors'
  const selectedClasses = props.selectedAnswer === option
    ? 'bg-blue-100 dark:bg-blue-900 border-blue-500'
    : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600'
  
  return `${baseClasses} ${selectedClasses}`
}
</script>