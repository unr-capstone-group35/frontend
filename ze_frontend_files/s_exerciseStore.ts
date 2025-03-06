// stores/exercise.ts
import { defineStore } from 'pinia'
import { useProgressStore } from './progressStore'
import { useLessonStore } from './lessonStore'
import type { Exercise } from './courseStore'

type ExerciseState = {
  currentExerciseId: string | null
  previousAnswers: Record<string, any> // key: courseId-lessonId-exerciseId, value: lastAnswer
  loading: boolean
  error: string
  submissionResults: Record<string, boolean> // key: courseId-lessonId-exerciseId, value: isCorrect
}

export const useExerciseStore = defineStore('exercise', {
  state: (): ExerciseState => ({
    currentExerciseId: null,
    previousAnswers: {},
    loading: false,
    error: '',
    submissionResults: {}
  }),

  getters: {
    // Get current exercise
    currentExercise(state): Exercise | null {
      const lessonStore = useLessonStore()
      const currentLesson = lessonStore.currentLesson
      
      if (!currentLesson || !state.currentExerciseId) return null
      
      return currentLesson.exercises.find(ex => ex.id === state.currentExerciseId) || null
    },
    
    // Get previous answer for the current exercise
    previousAnswer(state) {
      const lessonStore = useLessonStore()
      if (!lessonStore.currentCourseId || !lessonStore.currentLessonId || !state.currentExerciseId) {
        return null
      }
      
      const key = `${lessonStore.currentCourseId}-${lessonStore.currentLessonId}-${state.currentExerciseId}`
      return state.previousAnswers[key] || null
    },
    
    // Check if the current exercise has been attempted
    hasAttempted(state) {
      const lessonStore = useLessonStore()
      if (!lessonStore.currentCourseId || !lessonStore.currentLessonId || !state.currentExerciseId) {
        return false
      }
      
      const key = `${lessonStore.currentCourseId}-${lessonStore.currentLessonId}-${state.currentExerciseId}`
      return key in state.previousAnswers
    },
    
    // Check if the current exercise was answered correctly
    isCorrect(state) {
      const lessonStore = useLessonStore()
      if (!lessonStore.currentCourseId || !lessonStore.currentLessonId || !state.currentExerciseId) {
        return false
      }
      
      const key = `${lessonStore.currentCourseId}-${lessonStore.currentLessonId}-${state.currentExerciseId}`
      return state.submissionResults[key] || false
    }
  },

  actions: {
    // Set the current exercise
    setCurrentExercise(exerciseId: string) {
      this.currentExerciseId = exerciseId
    },
    
    // Submit an exercise answer
    async submitAnswer(answer: any): Promise<boolean> {
      const lessonStore = useLessonStore()
      const progressStore = useProgressStore()
      
      if (!lessonStore.currentCourseId || !lessonStore.currentLessonId || !this.currentExerciseId) {
        this.error = 'No active exercise'
        return false
      }
      
      const courseId = lessonStore.currentCourseId
      const lessonId = lessonStore.currentLessonId
      const exerciseId = this.currentExerciseId
      const key = `${courseId}-${lessonId}-${exerciseId}`
      
      this.loading = true
      this.error = ''
      
      try {
        console.log('Submitting exercise attempt:', {
          courseId,
          lessonId,
          exerciseId,
          answer: JSON.stringify(answer)
        })
        
        // Call the API to verify the answer
        const response = await useNuxtApp().$api<{ isCorrect: boolean }>(
          `http://localhost:8080/api/courses/${courseId}/lessons/${lessonId}/exercises/${exerciseId}/attempt`,
          {
            method: 'POST',
            body: JSON.stringify({ answer })
          }
        )
        
        // Store the result
        this.submissionResults[key] = response.isCorrect
        
        // Store the answer
        this.previousAnswers[key] = answer
        
        // Record the attempt in the progress store
        await progressStore.recordExerciseAttempt(courseId, lessonId, exerciseId, answer, response.isCorrect)
        
        // If correct, update lesson progress
        if (response.isCorrect) {
          // Check if this is the last exercise in the lesson
          const currentLesson = lessonStore.currentLesson
          if (currentLesson) {
            const isLastExercise = currentLesson.exercises.findIndex(ex => ex.id === exerciseId) === 
              currentLesson.exercises.length - 1
            
            // Update lesson status based on whether this is the last exercise
            await lessonStore.updateLessonStatus(
              courseId, 
              lessonId, 
              isLastExercise ? 'completed' : 'in_progress'
            )
          }
        }
        
        return response.isCorrect
      } catch (error: any) {
        this.error = error.message || 'Failed to submit answer'
        console.error(this.error)
        return false
      } finally {
        this.loading = false
      }
    },
    
    // Get the next exercise in the current lesson
    async nextExercise(): Promise<Exercise | null> {
      const lessonStore = useLessonStore()
      
      if (!lessonStore.currentCourseId || !lessonStore.currentLessonId || !this.currentExerciseId) {
        return null
      }
      
      const currentLesson = lessonStore.currentLesson
      if (!currentLesson || !currentLesson.exercises) {
        return null
      }
      
      const exercises = currentLesson.exercises
      const currentIndex = exercises.findIndex(ex => ex.id === this.currentExerciseId)
      
      // If not found or last exercise
      if (currentIndex === -1 || currentIndex >= exercises.length - 1) {
        return null
      }
      
      // Set next exercise as current
      const nextExercise = exercises[currentIndex + 1]
      this.currentExerciseId = nextExercise.id
      
      return nextExercise
    },
    
    // Reset the current exercise state (for retry)
    resetCurrentExercise() {
      const lessonStore = useLessonStore()
      
      if (!lessonStore.currentCourseId || !lessonStore.currentLessonId || !this.currentExerciseId) {
        return
      }
      
      const key = `${lessonStore.currentCourseId}-${lessonStore.currentLessonId}-${this.currentExerciseId}`
      delete this.previousAnswers[key]
      delete this.submissionResults[key]
    },
    
    // Clear exercise data (useful for logout or reset)
    clearExerciseData() {
      this.currentExerciseId = null
      this.previousAnswers = {}
      this.submissionResults = {}
      this.error = ''
    }
  }
})

// For easier access to the lesson store in getters
const lessonStore = useLessonStore()