<script setup>
// Script section remains exactly the same
import { ref, watch, onMounted } from "vue"
import draggable from "vuedraggable/src/vuedraggable"

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

const emit = defineEmits(["update-answer"])

const orderedItems = ref([])

onMounted(() => {
  initializeItems()
})

watch(
  () => props.exercise,
  () => {
    initializeItems()
  },
  { immediate: true }
)

watch(
  () => props.selectedAnswer,
  newVal => {
    if (newVal === null) {
      initializeItems()
    }
  }
)

function initializeItems() {
  if (!props.exercise?.items) {
    console.warn("No items found in exercise")
    return
  }

  const items = props.exercise.items.map((text, index) => ({
    id: `item-${index}`,
    text,
    originalIndex: index
  }))

  orderedItems.value = shuffleArray(items)
  handleChange()
}

function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function handleChange() {
  if (orderedItems.value.length > 0) {
    const indices = orderedItems.value.map(item => item.originalIndex)
    emit("update-answer", indices.map(Number))
  }
}

function getItemClasses(item, index) {
  const baseClasses = "bg-white dark:bg-gray-800 border"

  if (!props.showFeedback) {
    return `${baseClasses} border-gray-200 dark:border-gray-700`
  }

  const isCorrect = item.originalIndex === props.exercise.correctOrder[index]
  return isCorrect
    ? `${baseClasses} border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20`
    : `${baseClasses} border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20`
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
        <div class="flex select-none items-center gap-4">
          <!-- Drag Handle -->
          <div
            class="handle cursor-grab p-2 text-gray-500 transition-colors hover:text-gray-700 active:cursor-grabbing dark:text-gray-400 dark:hover:text-gray-300"
            :class="{ 'cursor-not-allowed opacity-50': showFeedback }"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9h8M8 15h8" />
            </svg>
          </div>

          <!-- Item Content -->
          <div
            :class="[
              'flex-1 rounded-lg p-4 text-gray-900 transition-all duration-200 dark:text-white',
              'hover:bg-gray-50 dark:hover:bg-gray-700',
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
