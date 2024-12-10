<!-- components/questions/Matching.vue -->
<template>
    <div class="space-y-6">
      <h3 class="text-xl font-medium text-gray-900 dark:text-white">
        {{ exercise.question }}
      </h3>
      
      <div class="grid grid-cols-2 gap-4">
        <!-- Left column (fixed) -->
        <div class="space-y-2">
          <div
            v-for="(pair, index) in exercise.pairs"
            :key="`left-${index}`"
            class="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            {{ pair[0] }}
          </div>
        </div>
        
        <!-- Right column (draggable) -->
        <draggable
          v-model="rightColumn"
          :disabled="showFeedback"
          item-key="id"
          class="space-y-2"
        >
          <template #item="{ element }">
            <div
              :class="[
                'p-4 rounded-lg cursor-move',
                getMatchItemClasses(element)
              ]"
            >
              {{ element.text }}
            </div>
          </template>
        </draggable>
      </div>
      
      <button
        v-if="!showFeedback"
        @click="checkMatches"
        class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
      >
        Check Matches
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
  
  const rightColumn = ref([])
  
  onMounted(() => {
    // Initialize with shuffled right column items
    rightColumn.value = props.exercise.pairs.map((pair, index) => ({
      id: index,
      text: pair[1],
      originalIndex: index
    })).sort(() => Math.random() - 0.5)
  })
  
  function checkMatches() {
    const isCorrect = rightColumn.value.every((item, index) => {
      return item.originalIndex === index
    })
    emit('answer-submitted', isCorrect)
  }
  
  function getMatchItemClasses(item) {
    if (!props.showFeedback) {
      return 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
    }
    
    return item.originalIndex === rightColumn.value.indexOf(item)
      ? 'bg-green-100 dark:bg-green-900 border-green-500'
      : 'bg-red-100 dark:bg-red-900 border-red-500'
  }
  </script>