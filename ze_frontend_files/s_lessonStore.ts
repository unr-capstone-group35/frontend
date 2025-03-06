// stores/lesson.ts
import { defineStore } from 'pinia'
import { useProgressStore } from './progressStore'
import type { Status } from './progressStore' 
import type { Lesson } from './courseStore'

type LessonState = {
  lessons: Record<string, Record<string, Lesson>> // courseId -> lessonId -> Lesson
  currentLessonId: string | null
  currentCourseId: string | null
  loading: boolean
  error: string
}

export const useLessonStore = defineStore('lesson', {
  state: (): LessonState => ({
    lessons: {},
    currentLessonId: null,
    currentCourseId: null,
    loading: false,
    error: ''
  }),

  getters: {
    // Get current lesson
    currentLesson: (state): Lesson | null => {
      if (!state.currentCourseId || !state.currentLessonId) return null
      
      const courseLessons = state.lessons[state.currentCourseId]
      if (!courseLessons) return null
      
      return courseLessons[state.currentLessonId] || null
    },
    
    // Get lessons for a specific course
    getLessonsForCourse: (state) => (courseId: string): Lesson[] => {
      const courseLessons = state.lessons[courseId]
      if (!courseLessons) return []
      
      return Object.values(courseLessons)
    },
    
    // Get lesson status
    getLessonStatus: (state) => (courseId: string, lessonId: string): Status => {
      const progressStore = useProgressStore()
      const lessonProgress = progressStore.getLessonProgress(courseId, lessonId)
      
      return lessonProgress?.status || 'not_started'
    }
  },

  actions: {
    // Initialize lessons for a course
    initializeLessons(courseId: string, lessons: Lesson[]) {
      if (!this.lessons[courseId]) {
        this.lessons[courseId] = {}
      }
      
      // Map lessons by their ID for easy access
      lessons.forEach(lesson => {
        this.lessons[courseId][lesson.id] = lesson
      })
    },
    
    // Fetch a specific lesson
    async fetchLesson(courseId: string, lessonId: string) {
      this.loading = true
      this.error = ''
      
      try {
        console.log(`Requesting lesson ${lessonId} from course ${courseId}`)
        
        const lessonData = await useNuxtApp().$api<Lesson>(
          `http://localhost:8080/api/courses/${courseId}/lessons/${lessonId}`,
          { method: 'GET' }
        )
        
        console.log(`Received lesson data:`, lessonData)
        
        // Initialize course lessons if needed
        if (!this.lessons[courseId]) {
          this.lessons[courseId] = {}
        }
        
        // Store the lesson
        this.lessons[courseId][lessonId] = lessonData
        
        // Set as current lesson
        this.currentCourseId = courseId
        this.currentLessonId = lessonId
        
        // Fetch lesson progress
        const progressStore = useProgressStore()
        await progressStore.fetchLessonProgress(courseId, lessonId)
        
        return lessonData
      } catch (error: any) {
        this.error = error.message || `Failed to fetch lesson ${lessonId}`
        console.error(this.error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // Select a lesson without fetching (if it's already loaded)
    selectLesson(courseId: string, lessonId: string) {
      // Check if we have the lesson data
      if (this.lessons[courseId]?.[lessonId]) {
        this.currentCourseId = courseId
        this.currentLessonId = lessonId
        return true
      }
      
      return false
    },
    
    // Update lesson status
    async updateLessonStatus(courseId: string, lessonId: string, status: Status) {
      // Use the progress store to update the status
      const progressStore = useProgressStore()
      return progressStore.updateLessonProgress(courseId, lessonId, status)
    },
    
    // Mark lesson as in progress
    async markLessonInProgress(courseId: string, lessonId: string) {
      return this.updateLessonStatus(courseId, lessonId, 'in_progress')
    },
    
    // Mark lesson as completed
    async markLessonCompleted(courseId: string, lessonId: string) {
      return this.updateLessonStatus(courseId, lessonId, 'completed')
    },
    
    // Clear lesson data (useful for logout or reset)
    clearLessonData() {
      this.lessons = {}
      this.currentLessonId = null
      this.currentCourseId = null
      this.error = ''
    }
  }
})