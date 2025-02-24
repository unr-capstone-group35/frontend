<script setup>
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

<template>
  <div class="space-y-2 bg-gray-50 p-4 dark:bg-gray-800/50">
    <button
      v-for="lesson in lessons"
      :key="lesson.id"
      @click="selectLesson(courseId, lesson.id)"
      :disabled="!canAccessLesson(courseId, lesson.id)"
      :class="getLessonClasses(lesson.id)"
    >
      <span>{{ lesson.title }}</span>
      <span v-if="courseStore.isLessonCompleted(courseId, lesson.id)" class="ml-2 text-emerald-500"> ✓ </span>
    </button>
  </div>
</template>
