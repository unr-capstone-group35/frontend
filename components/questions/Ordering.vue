<!-- components/questions/Ordering.vue -->
<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-xl font-medium text-gray-900 dark:text-white">
        {{ exercise.question }}
      </h3>
    </div>

    <draggable
      v-model="orderedItems"
      :disabled="showFeedback"
      item-key="id"
      :animation="200"
      ghost-class="ghost"
      class="space-y-2"
      handle=".handle"
      @change="handleChange"
    >
      <template #item="{ element }">
        <div class="flex items-center gap-4 select-none">
          <!-- Drag Handle -->
          <div 
            class="handle p-2 text-gray-500 hover:text-gray-700 cursor-grab active:cursor-grabbing"
            :class="{ 'opacity-50 cursor-not-allowed': showFeedback }"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9h8M8 15h8" />
            </svg>
          </div>

          <!-- Item Content -->
          <div 
            :class="[
              'flex-1 p-4 rounded-lg transition-colors',
              getItemClasses(element, orderedItems.indexOf(element))
            ]"
          >
            {{ element.text }}
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import draggable from 'vuedraggable/src/vuedraggable'

const props = defineProps({
  exercise: {
    type: Object,
    required: true
  },
  selectedAnswer: {
    type: Array,
    default: null
  },
  showFeedback: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update-answer'])

const orderedItems = ref([])

// Initialize items
onMounted(() => {
  initializeItems()
})

// Watch for exercise changes
watch(() => props.exercise, () => {
  initializeItems()
}, { immediate: true })

// Watch for reset
watch(() => props.selectedAnswer, (newVal) => {
  if (newVal === null) {
    initializeItems()
  }
})

function initializeItems() {
  if (!props.exercise?.items) {
    console.warn('No items found in exercise')
    return
  }

  // Create items with IDs and initial indices
  const items = props.exercise.items.map((text, index) => ({
    id: `item-${index}`,
    text,
    originalIndex: index
  }))
  
  // Shuffle items
  orderedItems.value = shuffleArray(items)
  // Emit initial order after shuffling
  handleChange()
}

function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function handleChange() {
  if (orderedItems.value.length > 0) {
    const indices = orderedItems.value.map(item => item.originalIndex)
    // Convert to array of numbers to match backend expectation
    emit('update-answer', indices.map(Number))
  }
}

function getItemClasses(item, index) {
  const baseClasses = 'bg-white dark:bg-gray-800 border'
  
  if (!props.showFeedback) {
    return `${baseClasses} border-gray-200 dark:border-gray-700`
  }
  
  const isCorrect = item.originalIndex === props.exercise.correctOrder[index]
  return isCorrect
    ? `${baseClasses} border-green-500 bg-green-50 dark:bg-green-900/20`
    : `${baseClasses} border-red-500 bg-red-50 dark:bg-red-900/20`
}
</script>

<style scoped>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.handle {
  touch-action: none;
}

.sortable-drag {
  opacity: 0;
}

.sortable-ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>