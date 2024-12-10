// stores/courseStore.js
import { defineStore } from 'pinia'
import { useAuthStore } from './authStore'

export const useCourseStore = defineStore('course', {
  state: () => ({
    courses: {},
    currentCourse: null,
    currentLesson: null,
    lessonProgress: {},
    courseProgress: {},
    loading: false,
    error: null
  }),

  getters: {
    isLessonCompleted: (state) => (courseId, lessonId) => {
      return state.lessonProgress[`${courseId}-${lessonId}`]?.status === 'completed'
    },

    nextExercise: (state) => (courseId, lessonId, currentExerciseId) => {
      if (!state.currentLesson?.exercises) return null

      const exerciseIndex = state.currentLesson.exercises.findIndex(
        ex => ex.id === currentExerciseId
      )

      if (exerciseIndex < state.currentLesson.exercises.length - 1) {
        return state.currentLesson.exercises[exerciseIndex + 1]
      }

      return null
    },

    courseProgress: (state) => (courseId) => {
      return state.courseProgress[courseId] || {
        startedAt: null,
        completedAt: null,
        progress: 0
      }
    }
  },

  actions: {
    // Fetch all available courses
    selectCourse(courseId) {
      this.selectedCourse = this.courses[courseId]
    },

    async fetchCourses() {
      try {
        this.loading = true
        const authStore = useAuthStore()
        
        const response = await fetch('http://localhost:8080/api/courses', {
          headers: authStore.getAuthHeaders()
        })

        if (!response.ok) throw new Error('Failed to fetch courses')
        
        const data = await response.json()
        this.courses = data.reduce((acc, course) => {
          acc[course.Name] = {
            id: course.Name,
            name: course.Name,
            lessons: []
          }
          return acc
        }, {})
      } catch (error) {
        this.error = error.message
        console.error('Error fetching courses:', error)
      } finally {
        this.loading = false
      }
    },

    // Fetch specific course and its lessons
    async fetchCourse(courseId) {
      try {
        this.loading = true
        const authStore = useAuthStore()
        
        const response = await fetch(`http://localhost:8080/api/courses/${courseId}`, {
          headers: authStore.getAuthHeaders()
        })

        if (!response.ok) throw new Error('Failed to fetch course')
        
        const courseData = await response.json()
        this.currentCourse = {
          id: courseData.Name,
          name: courseData.Name,
          lessons: courseData.LessonService || []
        }

        // Also fetch course progress
        await this.fetchCourseProgress(courseId)
      } catch (error) {
        this.error = error.message
        console.error('Error fetching course:', error)
      } finally {
        this.loading = false
      }
    },

    // Fetch lesson data
    async fetchLesson(courseId, lessonId) {
      try {
        this.loading = true
        const authStore = useAuthStore()
        
        const response = await fetch(
          `http://localhost:8080/api/courses/${courseId}/lessons/${lessonId}`,
          {
            headers: authStore.getAuthHeaders()
          }
        )

        if (!response.ok) throw new Error('Failed to fetch lesson')
        
        const lessonData = await response.json()
        this.currentLesson = lessonData

        // Also fetch lesson progress
        await this.fetchLessonProgress(courseId, lessonId)
      } catch (error) {
        this.error = error.message
        console.error('Error fetching lesson:', error)
      } finally {
        this.loading = false
      }
    },

    // Submit an exercise attempt
    async submitExerciseAttempt(courseId, lessonId, exerciseId, answer) {
      try {
        const authStore = useAuthStore()
        
        const response = await fetch(
          `http://localhost:8080/api/courses/${courseId}/lessons/${lessonId}/exercises/${exerciseId}/attempt`,
          {
            method: 'POST',
            headers: {
              ...authStore.getAuthHeaders(),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ answer })
          }
        )

        if (!response.ok) throw new Error('Failed to submit exercise attempt')
        
        const result = await response.json()
        
        // If exercise was completed successfully, update progress
        if (result.isCorrect) {
          await this.updateLessonProgress(courseId, lessonId, 'completed')
        }

        return result
      } catch (error) {
        this.error = error.message
        console.error('Error submitting exercise:', error)
        throw error
      }
    },

    // Fetch course progress
    async fetchCourseProgress(courseId) {
      try {
        const authStore = useAuthStore()
        
        const response = await fetch(
          `http://localhost:8080/api/courses/${courseId}/progress`,
          {
            headers: authStore.getAuthHeaders()
          }
        )

        if (!response.ok) throw new Error('Failed to fetch course progress')
        
        const progress = await response.json()
        this.courseProgress[courseId] = progress
      } catch (error) {
        console.error('Error fetching course progress:', error)
      }
    },

    // Fetch lesson progress
    async fetchLessonProgress(courseId, lessonId) {
      try {
        const authStore = useAuthStore()
        
        const response = await fetch(
          `http://localhost:8080/api/courses/${courseId}/lessons/${lessonId}/progress`,
          {
            headers: authStore.getAuthHeaders()
          }
        )

        if (!response.ok) throw new Error('Failed to fetch lesson progress')
        
        const progress = await response.json()
        this.lessonProgress[`${courseId}-${lessonId}`] = progress
      } catch (error) {
        console.error('Error fetching lesson progress:', error)
      }
    },

    // Update lesson progress
    async updateLessonProgress(courseId, lessonId, status) {
      try {
        const authStore = useAuthStore()
        
        const response = await fetch(
          `http://localhost:8080/api/courses/${courseId}/lessons/${lessonId}/progress`,
          {
            method: 'POST',
            headers: {
              ...authStore.getAuthHeaders(),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
          }
        )

        if (!response.ok) throw new Error('Failed to update lesson progress')
        
        // Refresh progress data
        await this.fetchLessonProgress(courseId, lessonId)
        await this.fetchCourseProgress(courseId)
      } catch (error) {
        console.error('Error updating lesson progress:', error)
        throw error
      }
    }
  }
})