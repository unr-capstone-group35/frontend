<template>
    <div class="course-card bg-white rounded-xl overflow-hidden shadow-lg flex flex-col md:flex-row border border-gray-200">
      <div class="md:w-1/3 relative">
        <div class="absolute inset-0 bg-gradient-to-br from-green-200 to-green-100 opacity-20"></div>
        <img :src="image" :alt="title" class="h-full w-full object-cover relative z-10" />
      </div>
      <div class="p-6 md:w-2/3">
        <h3 class="text-xl font-bold mb-3 text-gray-900">{{ title }}</h3>
        <p class="text-gray-600 mb-4 mt-4">{{ description }}</p>
        <div class="flex items-center">
          <span class="text-sm text-emerald-600">{{ duration }} hours</span>
          <span :class="[difficultyClass, 'ml-4 px-3 py-1 text-xs rounded-full text-white']">
            {{ difficulty }}
          </span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
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
      required: true,
      validator: (value) => ['Beginner', 'Medium', 'Hard'].includes(value)
    }
  })
  
  const difficultyClass = computed(() => {
    const classes = {
    'Beginner': 'bg-green-600',
    'Medium': 'bg-yellow-600',
    'Hard': 'bg-red-600'
    }
    return classes[props.difficulty] || 'bg-emerald-600'
  })
  </script>