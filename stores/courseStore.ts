// stores/course.ts

export type Course = {
  id: string;
  name: string;
  description: string;
  lessonAmount: number;
  lessons: Lesson[] | undefined;
};

export type Lesson = {
  id: string;
  title: string;
  description: string;
  exercises: Exercise[];
};

export type Exercise = {
  id: string;
  type: string;
  question: string;
  [key: string]: any; // For additional exercise-specific properties
};

type CourseState = {
  courses: Record<string, Course>;
  currentCourseId: string | null;
  loading: boolean;
  error: string;
};

export const useCourseStore = defineStore("course", {
  state: (): CourseState => ({
    courses: {},
    currentCourseId: null,
    loading: false,
    error: "",
  }),

  getters: {
    // Get current course
    currentCourse: (state): Course | null => {
      if (!state.currentCourseId) return null;
      return state.courses[state.currentCourseId] || null;
    },

    // Get all available courses
    availableCourses: (state): Course[] => {
      return Object.values(state.courses);
    },

    // Calculate course completion percentage
    calculateCourseProgress:
      (state) =>
      (courseId: string): number => {
        const course = state.courses[courseId];
        const progressStore = useProgressStore();

        if (!course || !course.lessons || course.lessons.length === 0) {
          return 0;
        }

        const totalLessons = course.lessons.length;
        let completedLessons = 0;

        course.lessons.forEach((lesson) => {
          if (progressStore.isLessonCompleted(courseId, lesson.id)) {
            completedLessons++;
          }
        });

        return Math.round((completedLessons / totalLessons) * 100);
      },

    // Check if a course is accessible (all are available as of Mar 5th 2025)
    isCourseAccessible:
      () =>
      (courseId: string): boolean => {
        return true;
      },
  },

  actions: {
    // Fetch all available courses
    async fetchCourses() {
      this.loading = true;
      this.error = "";

      type CourseInfo = {
        id: string;
        name: string;
        description: string;
        lessonAmount: number;
      };

      try {
        const courseInfos = await useNuxtApp().$api<CourseInfo[]>("http://localhost:8080/api/courses", {
          method: "GET",
        });

        // Update courses in the store
        for (const courseInfo of courseInfos) {
          this.courses[courseInfo.id] = {
            id: courseInfo.id,
            name: courseInfo.name,
            description: courseInfo.description,
            lessonAmount: courseInfo.lessonAmount,
            lessons: undefined,
          };
        }

        return courseInfos;
      } catch (error: any) {
        this.error = error.message || "Failed to fetch courses";
        console.error(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Fetch a single course with all its lessons
    async fetchCourse(courseId: string) {
      this.loading = true;
      this.error = "";

      try {
        console.log(`Requesting course with ID: ${courseId}`);

        const courseResponse = await useNuxtApp().$api<Course>(`http://localhost:8080/api/courses/${courseId}`, {
          method: "GET",
        });

        console.log(`Received course data for ${courseId}:`, courseResponse);

        if (!courseResponse || !courseResponse.lessons) {
          throw new Error("Invalid course data received");
        }

        // Update course in the store
        this.courses[courseResponse.id] = {
          id: courseResponse.id,
          name: courseResponse.name,
          description: courseResponse.description,
          lessonAmount: courseResponse.lessons.length || this.courses[courseResponse.id]?.lessonAmount || 0,
          lessons: courseResponse.lessons,
        };

        // Set as current course
        this.currentCourseId = courseResponse.id;

        // Initialize lesson store with the course's lessons
        const lessonStore = useLessonStore();
        lessonStore.initializeLessons(courseResponse.id, courseResponse.lessons);

        // Fetch course progress
        const progressStore = useProgressStore();
        await progressStore.fetchCourseProgress(courseId);

        return courseResponse;
      } catch (error: any) {
        this.error = error.message || `Failed to fetch course ${courseId}`;
        console.error(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Get a lesson from the current course (without API call)
    getLesson(lessonId: string): Lesson | null {
      if (!this.currentCourse || !this.currentCourse.lessons) {
        return null;
      }

      return this.currentCourse.lessons.find((lesson) => lesson.id === lessonId) || null;
    },

    // Find the next lesson in sequence
    getNextLesson(currentLessonId: string): Lesson | null {
      if (!this.currentCourse || !this.currentCourse.lessons) {
        return null;
      }

      const currentIndex = this.currentCourse.lessons.findIndex((lesson) => lesson.id === currentLessonId);

      if (currentIndex === -1 || currentIndex >= this.currentCourse.lessons.length - 1) {
        return null;
      }

      return this.currentCourse.lessons[currentIndex + 1];
    },

    // Determine if a lesson is accessible based on prerequisites
    canAccessLesson(courseId: string, lessonId: string): boolean {
      const course = this.courses[courseId];
      if (!course || !course.lessons) return false;

      const progressStore = useProgressStore();

      // Find the lesson index
      const lessonIndex = course.lessons.findIndex((l) => l.id === lessonId);

      // First lesson is always accessible
      if (lessonIndex === 0) return true;

      // For other lessons, check if the previous lesson is completed
      if (lessonIndex > 0) {
        const previousLesson = course.lessons[lessonIndex - 1];
        return progressStore.isLessonCompleted(courseId, previousLesson.id);
      }

      return false;
    },

    // Clear course data (useful for logout or reset)
    clearCourseData() {
      this.courses = {};
      this.currentCourseId = null;
      this.error = "";
    },
  },
});
