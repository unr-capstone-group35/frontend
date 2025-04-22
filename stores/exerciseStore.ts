// stores/exercise.ts

type ExerciseState = {
  currentExerciseId: string | null
  previousAnswers: Record<string, any> 
  loading: boolean
  error: string
  submissionResults: Record<string, boolean> 
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
    currentExercise(state) {
      // Import the store inside the getter
      const lessonStore = useLessonStore()
      const currentLesson = lessonStore.currentLesson
      
      if (!currentLesson || !state.currentExerciseId) return null
      
      return currentLesson.exercises.find(ex => ex.id === state.currentExerciseId) || null
    },
    
    // Get previous answer for the current exercise
    previousAnswer(state) {
      // Import the store inside the getter
      const lessonStore = useLessonStore()
      if (!lessonStore.currentCourseId || !lessonStore.currentLessonId || !state.currentExerciseId) {
        return null
      }
      
      const key = `${lessonStore.currentCourseId}-${lessonStore.currentLessonId}-${state.currentExerciseId}`
      return state.previousAnswers[key] || null
    },
    
    // Check if the current exercise has been attempted
    hasAttempted(state) {
      // Import the store inside the getter
      const lessonStore = useLessonStore()
      if (!lessonStore.currentCourseId || !lessonStore.currentLessonId || !state.currentExerciseId) {
        return false
      }
      
      const key = `${lessonStore.currentCourseId}-${lessonStore.currentLessonId}-${state.currentExerciseId}`
      return key in state.previousAnswers
    },
    
    // Check if the current exercise was answered correctly
    isCorrect(state) {
      // Import the store inside the getter
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
      const pointsStore = usePointsStore()
      
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
        
        // Use the points API endpoint instead of the regular one
        const response = await pointsStore.submitExerciseAttempt(
          courseId, 
          lessonId, 
          exerciseId, 
          answer
        )
        
        if (!response) {
          throw new Error('Failed to submit answer')
        }
        
        // Store the result
        this.submissionResults[key] = response.isCorrect
        
        // Store the answer
        this.previousAnswers[key] = answer
        
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
            
            // If this is the last exercise, also award lesson completion bonus
            if (isLastExercise) {
              await pointsStore.completeLesson(courseId, lessonId)
            }
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