export type CourseProgress = {
  id: number
  userId: number
  courseName: string
  startedAt: string
  lastAccessedAt: string
  completedAt: string
  progressPercentage: number
}

export type LessonProgress = {
  id: number
  userId: number
  courseName: number
  lessonId: number
  status: string
  startedAt: string
  completedAt: string
}

export type ExerciseAttempt = {
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

export type Lesson = {
  id: string
  title: string
  description: string
  exercises: Exercise[]
}

export type Exercise = {
  id: string
}

export type Course = {
  id: string
  name: string
  lessons: Lesson[]
}

type State = {
  courses: Record<string, Course>
  currentCourse: Course | null
  currentLesson: Lesson | null
  lessonProgress: Record<string, LessonProgress>
  courseProgress: Record<string, CourseProgress>
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
        const isCompleted = state.lessonProgress[`${courseId}-${lesson.id}`]?.status === "completed"
        return isCompleted ? count + 1 : count
      }, 0)

      // Return rounded percentage
      return Math.round((completedLessons / totalLessons) * 100)
    },

    getNextLesson: state => (currentLessonId: string) => {
      if (!state.currentCourse?.lessons) return null

      const currentIndex = state.currentCourse.lessons.findIndex(lesson => lesson.id === currentLessonId)

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
          if (!this.currentLesson) {
            throw new Error("currentLesson not defined")
            return
          }
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
        const lessonProgress = await useNuxtApp().$api<LessonProgress>(
          `http://localhost:8080/api/courses/${courseId}/progress`,
          { method: "GET" }
        )
        // fix this, its assigning courseProgress to lessonProgress?
        // this.courseProgress[formattedId] = {
        //   ...lessonProgress,
        //   progressPercentage: 0 //fix this later
        // }
      } catch (error: any) {
        this.error = error.message
        console.error(this.error)
        this.courseProgress[courseId] = {} as CourseProgress
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
        console.log(`Requesting course with formatted ID: ${courseId}`)

        const courseResponse = await useNuxtApp().$api<Course>(`http://localhost:8080/api/courses/${courseId}`, {
          method: "GET"
        })

        console.log(`Received course data for ${courseId}:`, courseResponse)

        console.log(courseResponse.lessons)
        if (!courseResponse || !courseResponse.lessons) {
          throw new Error("Invalid course data received")
        }

        this.currentCourse = {
          id: courseResponse.id,
          name: courseResponse.name,
          lessons: courseResponse.lessons || undefined
        }

        // Only try to fetch progress if course fetch was successful
        try {
          await this.fetchCourseProgress(courseId)
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

        console.log(`Requesting lesson ${lessonId} from course ${courseId}`)

        const lessonData = await useNuxtApp().$api<Lesson>(
          `http://localhost:8080/api/courses/${courseId}/lessons/${lessonId}`,
          {
            method: "GET"
          }
        )

        console.log(`Received lesson data:`, lessonData)

        this.currentLesson = lessonData

        // Try to fetch lesson progress after successful lesson fetch
        try {
          await this.fetchLessonProgress(courseId, lessonId)
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
          if (!this.currentLesson) {
            throw new Error("current lesson does not exist")
          }
          // currentExercise is in useLearn, not sure how this ever worked:
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
