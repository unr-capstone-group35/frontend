// stores/courseStore.js
import { defineStore } from "pinia"
import { useAuthStore } from "./authStore"
import { useRouter } from "vue-router"

export const useCourseStore = defineStore("course", {
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
    isLessonCompleted: state => (courseId, lessonId) => {
      return state.lessonProgress[`${courseId}-${lessonId}`]?.status === "completed"
    },

    formattedCourseId: () => courseId => {
      return courseId.replace(/\s+/g, "_")
    },

    currentExercises: state => {
      return state.currentLesson?.exercises || []
    },

    getCourseProgress: state => courseId => {
      // Check if we have current course data
      if (!state.currentCourse?.lessons || state.currentCourse.lessons.length === 0) {
        return 0
      }

      // Calculate total and completed lessons
      const totalLessons = state.currentCourse.lessons.length
      const completedLessons = state.currentCourse.lessons.reduce((count, lesson) => {
        const isCompleted = state.lessonProgress[`${courseId}-${lesson.lessonId}`]?.status === "completed"
        return isCompleted ? count + 1 : count
      }, 0)

      // Return rounded percentage
      return Math.round((completedLessons / totalLessons) * 100)
    },

    getNextLesson: state => currentLessonId => {
      if (!state.currentCourse?.lessons) return null

      const currentIndex = state.currentCourse.lessons.findIndex(lesson => lesson.lessonId === currentLessonId)

      if (currentIndex !== -1 && currentIndex < state.currentCourse.lessons.length - 1) {
        return state.currentCourse.lessons[currentIndex + 1]
      }

      return null
    }
  },

  createEmptyProgress() {
    return {
      startedAt: null,
      completedAt: null,
      progress_percentage: 0
    }
  },

  async getLessonProgress(courseId, lessonId) {
    try {
      const response = await fetch(`http://localhost:8080/api/courses/${courseId}/lessons/${lessonId}/progress`, {
        headers: {
          ...useAuthStore().getAuthHeaders(),
          "Content-Type": "application/json"
        },
        credentials: "include"
      })

      if (!response.ok) {
        throw new Error("Failed to fetch lesson progress")
      }

      const progress = await response.json()
      this.lessonProgress[`${courseId}-${lessonId}`] = progress
      return progress
    } catch (error) {
      console.error("Error getting lesson progress:", error)
      return null
    }
  },

  actions: {
    async nextExercise(courseId, lessonId, currentExerciseId) {
      if (!this.currentLesson || !this.currentLesson.exercises) {
        return null
      }

      const exercises = this.currentLesson.exercises
      if (!currentExerciseId) {
        return exercises[0] || null
      }

      const currentIndex = exercises.findIndex(ex => ex.id === currentExerciseId)
      if (currentIndex === -1 || currentIndex === exercises.length - 1) {
        // Only mark lesson as completed if this was the last exercise
        if (currentIndex === exercises.length - 1) {
          await this.updateLessonProgress(courseId, lessonId, "completed")
        }
        return null
      }

      return exercises[currentIndex + 1]
    },

    nextExercise(courseId, lessonId, currentExerciseId) {
      if (!this.currentLesson || !this.currentLesson.exercises) {
        return null
      }

      const exercises = this.currentLesson.exercises
      if (!currentExerciseId) {
        return exercises[0] || null
      }

      const currentIndex = exercises.findIndex(ex => ex.id === currentExerciseId)
      if (currentIndex === -1 || currentIndex === exercises.length - 1) {
        // If this was the last exercise, mark lesson as completed
        this.updateLessonProgress(courseId, lessonId, "completed")
        return null
      }

      return exercises[currentIndex + 1]
    },

    async submitExerciseAttempt(courseId, lessonId, exerciseId, answer) {
      try {
        console.log("Submitting exercise attempt:", {
          courseId,
          lessonId,
          exerciseId,
          answer: JSON.stringify(answer)
        })

        this.error = null
        const authStore = useAuthStore()

        const response = await fetch(
          `http://localhost:8080/api/courses/${courseId}/lessons/${lessonId}/exercises/${exerciseId}/attempt`,
          {
            method: "POST",
            headers: {
              ...authStore.getAuthHeaders(),
              "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ answer })
          }
        )

        if (!response.ok) {
          const errorText = await response.text()
          console.error("Server error:", errorText)
          throw new Error(`Failed to submit exercise attempt: ${errorText}`)
        }

        const result = await response.json()

        if (result.isCorrect) {
          // Only mark as completed if this is the last exercise
          const isLastExercise =
            this.currentLesson.exercises.findIndex(ex => ex.id === exerciseId) ===
            this.currentLesson.exercises.length - 1

          await this.updateLessonProgress(courseId, lessonId, isLastExercise ? "completed" : "in_progress")

          await this.fetchCourseProgress(courseId)
        }

        return result
      } catch (error) {
        this.error = error.message
        console.error("Exercise submission error:", error)
        throw error
      }
    },

    async fetchCourseProgress(courseId) {
      try {
        const authStore = useAuthStore()
        const formattedId = this.formattedCourseId(courseId)

        const response = await fetch(`http://localhost:8080/api/courses/${formattedId}/progress`, {
          headers: authStore.getAuthHeaders(),
          credentials: "include"
        })

        if (!response.ok) {
          // Handle 404
          if (response.status === 404) {
            this.courseProgress[formattedId] = this.createEmptyProgress()
            return
          }
          throw new Error(`Failed to fetch course progress: ${response.statusText}`)
        }

        const progress = await response.json()
        this.courseProgress[formattedId] = {
          ...progress,
          progress_percentage: progress.progress_percentage || progress.progress || 0
        }
      } catch (error) {
        console.error("Progress fetch failed:", error)
        this.courseProgress[this.formattedCourseId(courseId)] = this.createEmptyProgress()
      }
    },

    async fetchCourses() {
      try {
        this.loading = true
        this.error = null
        const authStore = useAuthStore()

        const response = await fetch("http://localhost:8080/api/courses", {
          headers: authStore.getAuthHeaders()
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch courses: ${response.statusText}`)
        }

        const courseNames = await response.json()
        this.courses = courseNames.reduce((acc, courseName) => {
          acc[courseName] = {
            id: courseName,
            name: courseName,
            lessons: []
          }
          return acc
        }, {})
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCourse(courseId) {
      try {
        this.loading = true
        this.error = null
        const authStore = useAuthStore()
        const formattedId = this.formattedCourseId(courseId)

        console.log(`Requesting course with formatted ID: ${formattedId}`)

        const response = await fetch(`http://localhost:8080/api/courses/${formattedId}`, {
          headers: authStore.getAuthHeaders()
        })

        if (!response.ok) {
          console.error(`Failed to fetch course. HTTP status: ${response.status}`)
          throw new Error(`Failed to fetch course: ${response.statusText}`)
        }

        const courseData = await response.json()

        console.log(`Received course data for ${formattedId}:`, courseData)

        if (!courseData || !courseData.Lessons) {
          throw new Error("Invalid course data received")
        }

        this.currentCourse = {
          id: courseData.Name,
          name: courseData.Name,
          lessons: courseData.Lessons || []
        }

        // Only try to fetch progress if course fetch was successful
        try {
          await this.fetchCourseProgress(formattedId)
        } catch (progressError) {
          console.warn("Could not fetch course progress:", progressError)
          // Don't fail the whole operation if progress fetch fails
        }

        return this.currentCourse
      } catch (error) {
        console.error("Error in fetchCourse:", error)
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchLesson(courseId, lessonId) {
      try {
        this.loading = true
        this.error = null
        const authStore = useAuthStore()
        const formattedId = this.formattedCourseId(courseId)

        console.log(`Requesting lesson ${lessonId} from course ${formattedId}`)

        const response = await fetch(`http://localhost:8080/api/courses/${formattedId}/lessons/${lessonId}`, {
          headers: authStore.getAuthHeaders()
        })

        if (!response.ok) {
          console.error(`Failed to fetch lesson. HTTP status: ${response.status}`)
          throw new Error(`Failed to fetch lesson: ${response.statusText}`)
        }

        const lessonData = await response.json()

        console.log(`Received lesson data:`, lessonData)

        this.currentLesson = lessonData

        // Try to fetch lesson progress after successful lesson fetch
        try {
          await this.fetchLessonProgress(formattedId, lessonId)
        } catch (progressError) {
          console.warn("Could not fetch lesson progress:", progressError)
          // Don't fail the whole operation if progress fetch fails
        }

        return this.currentLesson
      } catch (error) {
        console.error("Error in fetchLesson:", error)
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchLessonProgress(courseId, lessonId) {
      try {
        this.error = null
        const authStore = useAuthStore()

        const response = await fetch(`http://localhost:8080/api/courses/${courseId}/lessons/${lessonId}/progress`, {
          headers: authStore.getAuthHeaders(),
          credentials: "include"
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch lesson progress: ${response.statusText}`)
        }

        const progress = await response.json()
        this.lessonProgress[`${courseId}-${lessonId}`] = progress
        return progress
      } catch (error) {
        this.error = error.message
        console.error("Error fetching lesson progress:", error)
        throw error
      }
    },

    async updateLessonProgress(courseId, lessonId, status) {
      try {
        // Only allow completion if this is the last exercise
        if (status === "completed") {
          const currentExerciseIndex = this.currentLesson.exercises.findIndex(ex => ex.id === this.currentExercise?.id)

          if (currentExerciseIndex !== this.currentLesson.exercises.length - 1) {
            // If not the last exercise, mark as in_progress instead
            status = "in_progress"
          }
        }

        this.error = null
        const authStore = useAuthStore()

        const response = await fetch(`http://localhost:8080/api/courses/${courseId}/lessons/${lessonId}/progress`, {
          method: "POST",
          headers: {
            ...authStore.getAuthHeaders(),
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({ status })
        })

        if (!response.ok) {
          throw new Error(`Failed to update lesson progress: ${response.statusText}`)
        }

        await this.fetchLessonProgress(courseId, lessonId)
        await this.fetchCourseProgress(courseId)
      } catch (error) {
        this.error = error.message
        console.error("Error updating lesson progress:", error)
        throw error
      }
    }
  }
})
