<template>
  <div 
    class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer max-w-lg mx-auto"
  >
    <img :src="image" :alt="title" class="w-full h-40 object-cover" />
    <div 
    class="p-5 transition-colors duration-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50" @click="handleCourseSelect">
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ title }}</h3>
      <p class="text-gray-600 dark:text-gray-300 mb-4 text-sm">{{ description }}</p>
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-500 dark:text-gray-400">{{ duration }} hours</span>
        <span 
          class="px-3 py-1 rounded-full text-sm"
          :class="{
            'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100': difficulty.toLowerCase() === 'easy',
            'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100': difficulty.toLowerCase() === 'medium',
            'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100': difficulty.toLowerCase() === 'hard'
          }"
        >
          {{ difficulty }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCourseStore } from '~/stores/courseStore'

const props = defineProps({
  courseId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  difficulty: {
    type: String,
    required: true
  }
})

const router = useRouter()
const courseStore = useCourseStore()

const handleCourseSelect = async () => {
  try {
    // First select the course
    courseStore.selectCourse(props.courseId)
    // Then navigate
    await router.push('/learn')
  } catch (error) {
    console.error('Error navigating to learn page:', error)
  }
}
</script>