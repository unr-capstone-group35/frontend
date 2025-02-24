type Status = "completed" | "in_progress" | "not_started"

export interface Course {
  id: string
  name: string
  lessonAmount: number
  lessons: Lesson[] | undefined
}

export interface Lesson {
  id: string
  name: string
  description: string
  exercises: Exercise[] | undefined
}

export interface Exercise {
  id: string
  type: string
  question: string
  choices: string[]
  correctAnswer: any
  pairs: string[][]
  items: string[]
  correctOrder: number[]
}

interface CourseProgress {
  id: number
  userId: number
  courseId: string
  startedAt: Date
  lastAccessedAt: Date
  completedAt: Date
  progressPercentage: number
}

interface LessonProgress {
  id: number
  userId: number
  courseId: string
  lessonId: string
  status: Status
  startedAt: Date
  completedAt: Date
}

export const useCourseStore = defineStore("course", {
  state: () => ({
    courses: {} as Record<string, Course>,
    lessonProgress: {} as Record<string, LessonProgress>,
    courseProgress: {} as Record<string, CourseProgress>,
    loading: false,
    error: ""
  }),

  getters: {
    isLessonCompleted: state => (courseId: string, lessonId: string) => {
      return state.lessonProgress[`${courseId}-${lessonId}`]?.status === "completed"
    },
    getCourseProgress: state => (courseId: string) => {
      if (!state.courses[courseId] || state.courses[courseId].lessons === undefined) {
        return 0
      }

      const totalLessons = state.courses[courseId].lessonAmount
      const completedLessons = state.courses[courseId].lessons.reduce((count, lesson) => {
        const isCompleted = state.lessonProgress[`${courseId}-${lesson.id}`]?.status === "completed"
        return isCompleted ? count + 1 : count
      }, 0)

      return Math.round((completedLessons / totalLessons) * 100)
    },

    // getNextLesson: state => (currentLessonId: string) => {
    //   if (!state.currentCourse?.lessons) return null

    //   const currentIndex = state.currentCourse.lessons.findIndex(lesson => lesson.id === currentLessonId)

    //   if (currentIndex !== -1 && currentIndex < state.currentCourse.lessons.length - 1) {
    //     return state.currentCourse.lessons[currentIndex + 1]
    //   }

    //   return null
    // },
    //

    getLessonById: state => (courseId: string, lessonId: string) => {
      if (state.courses[courseId].lessons == undefined) {
        return undefined
      }
      return state.courses[courseId].lessons.find(lesson => lesson.id === lessonId)
    },
    getExerciseById: state => (courseId: string, lessonId: string, exerciseId: string) => {
      if (state.courses[courseId].lessons == undefined) {
        return undefined
      }
      const lesson = state.courses[courseId].lessons.find(lesson => lesson.id === lessonId)

      if (lesson == undefined) {
        return undefined
      }

      if (lesson.exercises == undefined) {
        return undefined
      }

      return lesson.exercises.find(exercise => exercise.id === exerciseId)
    }
  },

  actions: {
    //GET api/courses
    async fetchCourses() {
      // check if courses already fetched
      if (Object.values(this.courses).length > 0) {
        console.log("courses already fetched")
        return
      }

      interface CourseInfo {
        id: string
        name: string
        lessonAmount: number
      }

      try {
        this.loading = true
        this.error = ""

        const data = await useNuxtApp().$api<CourseInfo[]>("http://localhost:8080/api/courses", {
          method: "GET"
        })

        console.log("found courses", data)

        // add course info with lessonAmount, but not the lessons, we can fetch those as needed
        for (let i = 0; i < data.length; i++) {
          const courseId: string = data[i].id
          this.courses[courseId] = {
            id: data[i].id,
            name: data[i].name,
            lessonAmount: data[i].lessonAmount,
            lessons: undefined
          }
        }
      } catch (error: any) {
        this.error = `Failed to fetch courses: ${error}`
        console.error(this.error)
        throw error
      } finally {
        this.loading = false
      }
    },

    //GET /courses/{courseId}
    async fetchCourse(courseId: string) {
      if (this.courses[courseId].lessons != undefined) {
        console.log("lessons already fetched")
        return
      }
      try {
        this.loading = true
        this.error = ""

        console.log(`Requesting course with formatted Id: ${courseId}`)

        // we will recieve course with empty lessons
        const data = await useNuxtApp().$api<Course>(`http://localhost:8080/api/courses/${courseId}`, {
          method: "GET"
        })

        console.log(`Received course data for ${courseId}:`, data)

        // add lesson metadata, without exercises
        this.courses[courseId].lessons = data.lessons

        return this.courses[courseId]
      } catch (error: any) {
        this.error = `Failed to fetch course. ${error}`
        console.error(this.error)
        throw error
      } finally {
        this.loading = false
      }
    },

    //GET api/courses/${courseId}/progress
    async fetchCourseProgress(courseId: string) {
      try {
        const _this = this
        const data = await useNuxtApp().$api<CourseProgress>(`http://localhost:8080/api/courses/${courseId}/progress`, {
          method: "GET",
          async onResponseError({ request, response, options }) {
            if (response.status === 404) {
              _this.courseProgress[courseId] = {
                id: -1,
                userId: -1,
                courseId: courseId,
                startedAt: new Date(),
                completedAt: new Date(),
                lastAccessedAt: new Date(),
                progressPercentage: 0
              }
              return
            }
          }
        })

        this.courseProgress[courseId] = {
          ...data,
          progressPercentage: data.progressPercentage || 0
        }
      } catch (error) {
        console.error("Progress fetch failed:", error)
        this.courseProgress[courseId] = {
          id: -1,
          userId: -1,
          courseId: courseId,
          startedAt: new Date(),
          completedAt: new Date(),
          lastAccessedAt: new Date(),
          progressPercentage: 0
        }
      }
    },

    //GET /api/courses/{courseId}/lessons/{lessonId}
    async fetchLesson(courseId: string, lessonId: string) {
      if (this.courses[courseId] == undefined) {
        console.log("course undefined")
        return
      }

      if (this.courses[courseId].lessons == undefined) {
        console.log("lessons undefined")
        return
      }

      if (this.courses[courseId].lessons[0].exercises![0] != undefined) {
        console.log("exercises already fetched", this.courses[courseId].lessons[0].exercises)
        return
      }

      this.loading = true
      this.error = ""
      console.log(`Requesting lesson ${lessonId} from course ${courseId}`)

      try {
        const data = await useNuxtApp().$api<Lesson>(
          `http://localhost:8080/api/courses/${courseId}/lessons/${lessonId}`,
          {
            method: "GET"
          }
        )

        console.log(`Received lesson data:`, data)

        // laod exercises into lesson
        for (let i = 1; i < this.courses[courseId].lessons.length; i++) {
          if (this.courses[courseId].lessons[i].id == lessonId) {
            this.courses[courseId].lessons[i] = data
          }
        }

        this.currentLesson = data

        try {
          await this.fetchLessonProgress(courseId, lessonId)
        } catch (progressError) {
          console.warn("Could not fetch lesson progress:", progressError)
        }

        return data
      } catch (error: any) {
        this.error = `Failed to fetch lesson: ${error}`
        console.error(this.error)
        throw error
      } finally {
        this.loading = false
      }
    },
    //GET /api/courses/{courseId}/lessons/{lessonId}/progress
    async fetchLessonProgress(courseId: string, lessonId: string) {
      try {
        this.error = ""

        const data = await useNuxtApp().$api<LessonProgress>(
          `http://localhost:8080/api/courses/${courseId}/lessons/${lessonId}/progress`,
          {
            method: "GET"
          }
        )

        this.lessonProgress[`${courseId}-${lessonId}`] = data
        return data
      } catch (error) {
        this.error = `Failed to fetch lesson progress: ${error}`
        console.error(this.error)
        throw error
      }
    },

    //POST /api/courses/{courseId}/lessons/{lessonId}/progress
    async updateLessonProgress(courseId: string, lessonId: string, status: Status) {
      try {
        // Only allow completion if this is the last exercise
        if (status === "completed") {
          if (this.currentLesson == null) {
            return
          }

          if (this.currentLesson == undefined) {
            throw new Error("Current lesson is undefined")
          }

          if (this.currentLesson.exercises == undefined) {
            throw new Error("Current lesson exercises is undefined")
          }

          if (this.currentExercise == undefined) {
            throw new Error("Current exercise is undefined")
          }

          const currentExerciseIndex = this.currentLesson.exercises.findIndex(ex => ex.id === this.currentExercise?.id)

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
        this.error = `Failed to update lesson progress: ${error}`
        console.error(this.error)
        throw error
      }
    },

    async getNextExercise(
      courseId: string,
      lessonId: string,
      currentExerciseIndex?: number
    ): Promise<Exercise | undefined> {
      const lesson = this.getLessonById(courseId, lessonId)
      if (lesson == undefined) {
        return undefined
      }

      if (lesson.exercises == undefined) {
        return undefined
      }

      if (currentExerciseIndex == undefined) {
        return lesson.exercises[0]
      }

      if (currentExerciseIndex === -1 || currentExerciseIndex === lesson.exercises.length - 1) {
        if (currentExerciseIndex === lesson.exercises.length - 1) {
          await this.updateLessonProgress(courseId, lessonId, "completed")
        }
        return undefined
      }

      return lesson.exercises[currentExerciseIndex + 1]
    },
    // POST api/courses/${courseId}/lessons/${lessonId}/exercises/${exerciseId}/attempt
    async submitExerciseAttempt(courseId: string, lessonId: string, exerciseId: string, answer: any) {
      try {
        console.log("Submitting exercise attempt:", {
          courseId,
          lessonId,
          exerciseId,
          answer: JSON.stringify(answer)
        })

        this.error = ""

        interface Response {
          isCorrect: boolean
        }

        const data = await useNuxtApp().$api<Response>(
          `http://localhost:8080/api/courses/${courseId}/lessons/${lessonId}/exercises/${exerciseId}/attempt`,
          {
            method: "POST",
            body: JSON.stringify({ answer }),
            async onResponseError({ response }) {
              throw new Error(`Failed to submit exercise attempt: ${response._data}`)
            }
          }
        )
        if (this.currentLesson == undefined) {
          throw new Error("Current lesson is undefined")
        }

        if (this.currentLesson.exercises == undefined) {
          throw new Error("Current lesson exercises is undefined")
        }

        if (data.isCorrect) {
          const isLastExercise =
            this.currentLesson.exercises.findIndex(ex => ex.id === exerciseId) ===
            this.currentLesson.exercises.length - 1

          await this.updateLessonProgress(courseId, lessonId, isLastExercise ? "completed" : "in_progress")

          await this.fetchCourseProgress(courseId)
        }

        return data
      } catch (error: any) {
        console.error(this.error)
        throw error
      }
    },

    async selectCourse(courseId: string) {
      if (!this.courses[courseId].id) {
        try {
          await this.fetchCourse(courseId)
        } catch (error) {
          console.error("Error selecting course:", error)
        }
      }

      this.currentCourse = this.courses[courseId]
    },
    async selectLesson(courseId: string, lessonId: string) {
      if (!this.courses[courseId].lessons) {
        await this.fetchLesson(courseId, lessonId)
      }

      const lesson = this.courses[courseId]!.lessons!.find(i => i.id === lessonId)
      this.currentLesson = lesson
      this.currentExercise = this.currentLesson!.exercises![0]
    }
  }
})
