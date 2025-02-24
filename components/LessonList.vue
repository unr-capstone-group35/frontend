<!-- components/LessonList.vue -->
<template>
  <div class="space-y-2 bg-gray-50 p-4 dark:bg-gray-800/50">
    <button
      v-for="lesson in lessons"
      :key="lesson.lessonId"
      @click="selectLesson(courseId, lesson.lessonId)"
      :disabled="!canAccessLesson(courseId, lesson.lessonId)"
      :class="getLessonClasses(lesson.lessonId)"
    >
      <span>{{ lesson.title }}</span>
      <span v-if="courseStore.isLessonCompleted(courseId, lesson.lessonId)" class="ml-2 text-emerald-500"> ✓ </span>
    </button>
  </div>
</template>

<script setup>
import { useLearn } from "~/composables/useLearn"

const props = defineProps({
  courseId: {
    type: String,
    required: true
  },
  lessons: {
    type: Array,
    required: true
  }
})

const { courseStore, selectLesson, canAccessLesson, getLessonClasses } = useLearn()
</script>
