import { useNuxt } from "nuxt/kit"

type CourseProgress = {
  id: number
  userID: number
  courseName: string
  startedAt: string
  lastAccessedAt: string
  completedAt: string
}

type LessonProgress = {
  id: number
  userId: number
  courseName: number
  lessonId: number
  status: string
  startedAt: string
  completedAt: string
  progressPercentage: number
}

type ExerciseAttempt = {
  id: number
  userId: number
  courseName: string
  lessonId: string
  exerciseId: string
  attemptNumber: number
  answer: string
  isCorrect: boolean
  attemptedAt: string
}

type Lesson = {
  lessonId: string
  title: string
  description: string
  exercises: Exercise[]
}

type Exercise = {
  id: string
}

type Course = {
  id: string
  name: string
  lessons: Lesson[]
}

type State = {
  courses: Record<string, Course>
  currentCourse: Course | null
  currentLesson: Lesson | null
  lessonProgress: Record<string, LessonProgress>
  courseProgress: Record<string, LessonProgress>
  loading: boolean
  error: string
}

export const useCourseStore = defineStore("course", {
  state: (): State => ({
    courses: {},
    currentCourse: null,
    currentLesson: null,
    lessonProgress: {},
    courseProgress: {},
    loading: false,
    error: ""
  }),

  getters: {
    isLessonCompleted: state => (courseId: string, lessonId: string) => {
      return state.lessonProgress[`${courseId}-${lessonId}`]?.status === "completed"
    },

    formattedCourseId: () => (courseId: string) => {
      return courseId.replace(/\s+/g, "_")
    },

    currentExercises: state => {
      return state.currentLesson?.exercises || []
    },

    getCourseProgress: state => (courseId: string) => {
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

    getNextLesson: state => (currentLessonId: string) => {
      if (!state.currentCourse?.lessons) return null

      const currentIndex = state.currentCourse.lessons.findIndex(lesson => lesson.lessonId === currentLessonId)

      if (currentIndex !== -1 && currentIndex < state.currentCourse.lessons.length - 1) {
        return state.currentCourse.lessons[currentIndex + 1]
      }

      return null
    }
  },

  actions: {
    createEmptyProgress() {
      return {
        startedAt: null,
        completedAt: null,
        progress_percentage: 0
      }
    },

    // GET /api/courses/${courseId}/lessons/${lessonId}/progress
    async fetchLessonProgress(courseId: string, lessonId: string) {
      try {
        const getLessonProgressResponse = await useNuxtApp().$api<LessonProgress>(
          `http://localhost:8080/api/courses/${courseId}/lessons/${lessonId}/progress`,
          {
            method: "GET"
          }
        )

        this.lessonProgress[`${courseId}-${lessonId}`] = getLessonProgressResponse
        return getLessonProgressResponse
      } catch (error: any) {
        this.error = error.message
        console.error(this.error)
        return null
      }
    },
    async nextExercise(courseId: string, lessonId: string, currentExerciseId: string) {
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

    // POST /api/courses/${courseId}/lessons/${lessonId}/exercises/${exerciseId}/attempt
    async submitExerciseAttempt(courseId: string, lessonId: string, exerciseId: string, answer: string) {
      type AttemptResponse = {
        isCorrect: boolean
      }
      try {
        console.log("Submitting exercise attempt:", {
          courseId,
          lessonId,
          exerciseId,
          answer: JSON.stringify(answer)
        })

        this.error = ""

        const attemptResponse = await useNuxtApp().$api<AttemptResponse>(
          `http://localhost:8080/api/courses/${courseId}/lessons/${lessonId}/exercises/${exerciseId}/attempt`,
          {
            method: "POST",
            body: JSON.stringify({ answer })
          }
        )

        if (attemptResponse.isCorrect) {
          // Only mark as completed if this is the last exercise
          const isLastExercise =
            this.currentLesson?.exercises.findIndex(ex => ex.id === exerciseId) ===
            this.currentLesson?.exercises?.length - 1

          await this.updateLessonProgress(courseId, lessonId, isLastExercise ? "completed" : "in_progress")

          await this.fetchCourseProgress(courseId)
        }

        return attemptResponse
      } catch (error: any) {
        this.error = error.message
        console.error(this.error)
        throw error
      }
    },

    // GET /api/courses/${formattedId}/progress
    async fetchCourseProgress(courseId: string) {
      try {
        const formattedId = this.formattedCourseId(courseId)

        const lessonProgress = await useNuxtApp().$api<LessonProgress>(
          `http://localhost:8080/api/courses/${formattedId}/progress`,
          { method: "GET" }
        )

        this.courseProgress[formattedId] = {
          ...lessonProgress,
          progressPercentage: 0 //fix this later
        }
      } catch (error: any) {
        this.error = error.message
        console.error(this.error)
        this.courseProgress[this.formattedCourseId(courseId)] = this.createEmptyProgress()
      }
    },
    // GET /api/courses
    async fetchCourses() {
      try {
        this.loading = true
        this.error = ""

        const courseNames = await useNuxtApp().$api<string[]>("http://localhost:8080/api/courses", {
          method: "GET"
        })

        for (const courseName of courseNames) {
          this.courses[courseName] = { id: courseName, name: courseName, lessons: [] }
        }
      } catch (error: any) {
        this.error = error.message
        console.error(this.error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // GET /api/courses/${formattedId}
    async fetchCourse(courseId: string) {
      this.loading = true
      this.error = ""
      try {
        const formattedId = this.formattedCourseId(courseId)

        console.log(`Requesting course with formatted ID: ${formattedId}`)

        const courseResponse = await useNuxtApp().$api<Course>(`http://localhost:8080/api/courses/${formattedId}`, {
          method: "GET"
        })

        console.log(`Received course data for ${formattedId}:`, courseResponse)

        console.log(courseResponse.lessons)
        if (!courseResponse || !courseResponse.lessons) {
          throw new Error("Invalid course data received")
        }

        this.currentCourse = {
          id: courseResponse.name,
          name: courseResponse.name,
          lessons: courseResponse.lessons || []
        }

        // Only try to fetch progress if course fetch was successful
        try {
          await this.fetchCourseProgress(formattedId)
        } catch (progressError) {
          console.warn("Could not fetch course progress:", progressError)
          // Don't fail the whole operation if progress fetch fails
        }
      } catch (error: any) {
        this.error = error.message
        console.error(this.error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // GET /api/courses/${formattedId}/lessons/${lessonId}
    async fetchLesson(courseId: string, lessonId: string) {
      try {
        this.loading = true
        this.error = ""
        const formattedId = this.formattedCourseId(courseId)

        console.log(`Requesting lesson ${lessonId} from course ${formattedId}`)

        const lessonData = await useNuxtApp().$api<Lesson>(
          `http://localhost:8080/api/courses/${formattedId}/lessons/${lessonId}`,
          {
            method: "GET"
          }
        )

        console.log(`Received lesson data:`, lessonData)

        this.currentLesson = lessonData

        // Try to fetch lesson progress after successful lesson fetch
        try {
          await this.fetchLessonProgress(formattedId, lessonId)
        } catch (progressError) {
          console.warn("Could not fetch lesson progress:", progressError)
          // Don't fail the whole operation if progress fetch fails
        }
      } catch (error: any) {
        this.error = error.message
        console.error(this.error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateLessonProgress(courseId: string, lessonId: string, status: any) {
      try {
        // Only allow completion if this is the last exercise
        if (status === "completed") {
          const currentExerciseIndex = this.currentLesson?.exercises.findIndex(ex => ex.id === this.currentExercise?.id)

          if (currentExerciseIndex !== this.currentLesson.exercises.length - 1) {
            // If not the last exercise, mark as in_progress instead
            status = "in_progress"
          }
        }

        this.error = ""

        await useNuxtApp().$api(`http://localhost:8080/api/courses/${courseId}/lessons/${lessonId}/progress`, {
          method: "POST",
          body: JSON.stringify({ status })
        })

        await this.fetchLessonProgress(courseId, lessonId)
        await this.fetchCourseProgress(courseId)
      } catch (error: any) {
        this.error = error.message
        console.error(this.error)
        throw error
      }
    }
  }
})
