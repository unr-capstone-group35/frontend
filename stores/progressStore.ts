// stores/progress.ts
import { defineStore } from "pinia";

export type Status = "not_started" | "in_progress" | "completed";

export type CourseProgress = {
  id: number;
  userId: number;
  courseName: string;
  courseId: string;
  status: Status;
  startedAt: string;
  lastAccessedAt: string;
  completedAt: string | null;
  progressPercentage: number;
};

export type LessonProgress = {
  id: number;
  userId: number;
  courseId: string;
  lessonId: string;
  status: Status;
  startedAt: string;
  lastAccessedAt: string;
  completedAt: string | null;
};

export type ExerciseAttempt = {
  id: number;
  userId: number;
  courseId: string;
  lessonId: string;
  exerciseId: string;
  attemptNumber: number;
  answer: string;
  isCorrect: boolean;
  attemptedAt: string;
};

type ProgressState = {
  courseProgress: Record<string, CourseProgress>;
  lessonProgress: Record<string, LessonProgress>;
  exerciseAttempts: Record<string, ExerciseAttempt[]>;
  loading: boolean;
  error: string;
};

export const useProgressStore = defineStore("progress", {
  state: (): ProgressState => ({
    courseProgress: {},
    lessonProgress: {},
    exerciseAttempts: {},
    loading: false,
    error: "",
  }),

  getters: {
    // Get progress for a specific course
    getCourseProgress:
      (state) =>
      (courseId: string): CourseProgress | null => {
        return state.courseProgress[courseId] || null;
      },

    // Get progress for a specific lesson
    getLessonProgress:
      (state) =>
      (courseId: string, lessonId: string): LessonProgress | null => {
        const key = `${courseId}-${lessonId}`;
        return state.lessonProgress[key] || null;
      },

    // Get all attempts for a specific exercise
    getExerciseAttempts:
      (state) =>
      (courseId: string, lessonId: string, exerciseId: string): ExerciseAttempt[] => {
        const key = `${courseId}-${lessonId}-${exerciseId}`;
        return state.exerciseAttempts[key] || [];
      },

    // Get the most recent attempt for a specific exercise
    getLatestExerciseAttempt:
      (state) =>
      (courseId: string, lessonId: string, exerciseId: string): ExerciseAttempt | null => {
        const attempts = state.exerciseAttempts[`${courseId}-${lessonId}-${exerciseId}`] || [];
        if (attempts.length === 0) return null;

        // Sort by attempt number in descending order and get the first one
        return [...attempts].sort((a, b) => b.attemptNumber - a.attemptNumber)[0];
      },

    // Check if a lesson is completed
    isLessonCompleted:
      (state) =>
      (courseId: string, lessonId: string): boolean => {
        const key = `${courseId}-${lessonId}`;
        return state.lessonProgress[key]?.status === "completed";
      },
  },

  actions: {
    // Fetch course progress from API
    async fetchCourseProgress(courseId: string) {
      this.loading = true;
      this.error = "";

      try {
        const progress = await useNuxtApp().$api<CourseProgress>(
          `http://localhost:8080/api/courses/${courseId}/progress`,
          { method: "GET" },
        );

        this.courseProgress[courseId] = progress;
        return progress;
      } catch (error: any) {
        this.error = error.message || "Failed to fetch course progress";
        console.error(this.error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    // Fetch lesson progress from API
    async fetchLessonProgress(courseId: string, lessonId: string) {
      this.loading = true;
      this.error = "";

      try {
        const progress = await useNuxtApp().$api<LessonProgress>(
          `http://localhost:8080/api/courses/${courseId}/lessons/${lessonId}/progress`,
          { method: "GET" },
        );

        this.lessonProgress[`${courseId}-${lessonId}`] = progress;
        return progress;
      } catch (error: any) {
        this.error = error.message || "Failed to fetch lesson progress";
        console.error(this.error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    // Update lesson progress status in the API
    async updateLessonProgress(courseId: string, lessonId: string, status: Status) {
      this.loading = true;
      this.error = "";

      try {
        await useNuxtApp().$api(`http://localhost:8080/api/courses/${courseId}/lessons/${lessonId}/progress`, {
          method: "POST",
          body: JSON.stringify({ status }),
        });

        // Refresh progress data after update
        await this.fetchLessonProgress(courseId, lessonId);
        await this.fetchCourseProgress(courseId);

        return true;
      } catch (error: any) {
        this.error = error.message || "Failed to update lesson progress";
        console.error(this.error);
        return false;
      } finally {
        this.loading = false;
      }
    },

    // Record a new exercise attempt in the API
    async recordExerciseAttempt(
      courseId: string,
      lessonId: string,
      exerciseId: string,
      answer: any,
      isCorrect: boolean,
    ) {
      const key = `${courseId}-${lessonId}-${exerciseId}`;

      // Get current attempts to determine the next attempt number
      const attempts = this.exerciseAttempts[key] || [];
      const attemptNumber = attempts.length > 0 ? Math.max(...attempts.map((a) => a.attemptNumber)) + 1 : 1;

      // Create new attempt object
      const newAttempt: ExerciseAttempt = {
        id: 0, // Will be assigned by the server
        userId: 0, // Will be assigned by the server
        courseId,
        lessonId,
        exerciseId,
        attemptNumber,
        answer: JSON.stringify(answer),
        isCorrect,
        attemptedAt: new Date().toISOString(),
      };

      // Update local state
      if (!this.exerciseAttempts[key]) {
        this.exerciseAttempts[key] = [];
      }

      this.exerciseAttempts[key].push(newAttempt);

      return newAttempt;
    },

    // Clear progress data (useful for logout or reset)
    clearProgressData() {
      this.courseProgress = {};
      this.lessonProgress = {};
      this.exerciseAttempts = {};
      this.error = "";
    },
  },
});
