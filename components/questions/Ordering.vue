<!-- components/questions/Ordering.vue -->
<template>
    <div class="space-y-6">
      <h3 class="text-xl font-medium text-gray-900 dark:text-white">
        {{ exercise.question }}
      </h3>
      
      <draggable
        v-model="orderedItems"
        :disabled="showFeedback"
        item-key="id"
        class="space-y-2"
      >
        <template #item="{ element }">
          <div
            :class="[
              'p-4 rounded-lg cursor-move',
              getDragItemClasses(element)
            ]"
          >
            {{ element.text }}
          </div>
        </template>
      </draggable>
      
      <button
        v-if="!showFeedback"
        @click="checkOrder"
        class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
      >
        Check Order
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { VueDraggableNext as draggable } from 'vue-draggable-next'
  
  const props = defineProps({
    exercise: {
      type: Object,
      required: true
    },
    showFeedback: Boolean,
    isCorrect: Boolean
  })
  
  const emit = defineEmits(['answer-submitted'])
  
  const orderedItems = ref([])
  
  onMounted(() => {
    // Initialize with shuffled items
    orderedItems.value = props.exercise.items.map((text, index) => ({
      id: index,
      text,
      originalIndex: index
    })).sort(() => Math.random() - 0.5)
  })
  
  function checkOrder() {
    const currentOrder = orderedItems.value.map(item => item.originalIndex)
    const isCorrect = currentOrder.every((item, index) => item === props.exercise.correctOrder[index])
    emit('answer-submitted', isCorrect)
  }
  
  function getDragItemClasses(item) {
    if (!props.showFeedback) {
      return 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
    }
    
    const correctIndex = props.exercise.correctOrder[orderedItems.value.indexOf(item)]
    return item.originalIndex === correctIndex
      ? 'bg-green-100 dark:bg-green-900 border-green-500'
      : 'bg-red-100 dark:bg-red-900 border-red-500'
  }
  </script>