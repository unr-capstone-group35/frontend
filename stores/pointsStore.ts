import { defineStore } from "pinia";

export type PointTransaction = {
  id: number;
  userId: number;
  courseId: string;
  lessonId: string;
  exerciseId?: string;
  transactionType: string;
  points: number;
  description: string;
  createdAt: string;
};

export type PointsSummary = {
  totalPoints: number;
  currentStreak: number;
  maxStreak: number;
  recentTransactions?: PointTransaction[];
};

export type LessonPointsData = {
  courseId: string;
  lessonId: string;
  totalPoints: number;
  currentStreak: number;
  maxStreak: number;
};

export type ExercisePointsResult = {
  isCorrect: boolean;
  points: number;
  transaction?: PointTransaction;
  currentStreak: number;
  maxStreak: number;
  accuracyRate: number;
  totalAttempts: number;
  correctAttempts: number;
};

export type LeaderboardEntry = {
  userId: number;
  username: string;
  totalPoints: number;
  profilePicture?: string;
  rank: number;
};

export type DailyStreakInfo = {
  currentStreak: number;
  maxStreak: number;
  lastLoginDate?: string;
  nextMilestone?: number;
  daysToMilestone?: number;
};

export type AccuracyStats = {
  totalAttempts: number;
  correctAttempts: number;
  accuracyRate: number;
};

export const usePointsStore = defineStore("points", {
  state: () => ({
    summary: null as PointsSummary | null,
    lessonPoints: {} as Record<string, LessonPointsData>,
    leaderboard: [] as LeaderboardEntry[],
    dailyStreak: null as DailyStreakInfo | null,
    accuracyStats: null as AccuracyStats | null,
    loading: false,
    error: "",
  }),

  getters: {
    totalPoints: (state): number => {
      return state.summary?.totalPoints || 0;
    },

    currentStreak: (state): number => {
      return state.summary?.currentStreak || 0;
    },

    maxStreak: (state): number => {
      return state.summary?.maxStreak || 0;
    },

    currentDailyStreak: (state): number => {
      return state.dailyStreak?.currentStreak || 0;
    },

    maxDailyStreak: (state): number => {
      return state.dailyStreak?.maxStreak || 0;
    },

    daysToNextMilestone: (state): number => {
      return state.dailyStreak?.daysToMilestone || 0;
    },

    accuracyRate: (state): number => {
      return state.accuracyStats?.accuracyRate || 0;
    },

    totalAttempts: (state): number => {
      return state.accuracyStats?.totalAttempts || 0;
    },

    correctAttempts: (state): number => {
      return state.accuracyStats?.correctAttempts || 0;
    },

    recentTransactions: (state): PointTransaction[] => {
      return state.summary?.recentTransactions || [];
    },

    getLessonPoints:
      (state) =>
      (courseId: string, lessonId: string): LessonPointsData | null => {
        const key = `${courseId}-${lessonId}`;
        return state.lessonPoints[key] || null;
      },

    getLessonStreak:
      (state) =>
      (courseId: string, lessonId: string): number => {
        const key = `${courseId}-${lessonId}`;
        return state.lessonPoints[key]?.currentStreak || 0;
      },
  },

  actions: {
    async fetchPointsSummary(limit: number = 5) {
      this.loading = true;
      this.error = "";

      try {
        const response = await useNuxtApp().$api<PointsSummary>(`/points/summary?limit=${limit}`, { method: "GET" });

        this.summary = response;
        return response;
      } catch (error: any) {
        this.error = error.message || "Failed to fetch points summary";
        console.error(this.error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    // Fetch points for a specific lesson
    async fetchLessonPoints(courseId: string, lessonId: string) {
      this.loading = true;
      this.error = "";

      try {
        const response = await useNuxtApp().$api<LessonPointsData>(`/courses/${courseId}/lessons/${lessonId}/points`, {
          method: "GET",
        });

        const key = `${courseId}-${lessonId}`;
        this.lessonPoints[key] = response;
        return response;
      } catch (error: any) {
        this.error = error.message || "Failed to fetch lesson points";
        console.error(this.error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    async submitExerciseAttempt(courseId: string, lessonId: string, exerciseId: string, answer: any) {
      this.loading = true;
      this.error = "";

      try {
        const response = await useNuxtApp().$api<ExercisePointsResult>(
          `/courses/${courseId}/lessons/${lessonId}/exercises/${exerciseId}/points`,
          {
            method: "POST",
            body: JSON.stringify({ answer }),
          },
        );

        // Update accuracy stats from the response
        if (response) {
          this.accuracyStats = {
            totalAttempts: response.totalAttempts,
            correctAttempts: response.correctAttempts,
            accuracyRate: response.accuracyRate,
          };
        }

        // Refresh data after submission
        await this.fetchLessonPoints(courseId, lessonId);

        return response;
      } catch (error: any) {
        this.error = error.message || "Failed to submit exercise";
        console.error(this.error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    async completeLesson(courseId: string, lessonId: string) {
      this.loading = true;
      this.error = "";

      try {
        const response = await useNuxtApp().$api<PointTransaction>(
          `/courses/${courseId}/lessons/${lessonId}/complete`,
          { method: "POST" },
        );

        // Refresh data after completion
        await this.fetchLessonPoints(courseId, lessonId);
        await this.fetchPointsSummary();

        return response;
      } catch (error: any) {
        this.error = error.message || "Failed to complete lesson";
        console.error(this.error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    // Complete a course with points
    async completeCourse(courseId: string) {
      this.loading = true;
      this.error = "";

      try {
        const response = await useNuxtApp().$api<PointTransaction>(`/courses/${courseId}/complete`, { method: "POST" });

        // Refresh points summary after completion
        await this.fetchPointsSummary();

        return response;
      } catch (error: any) {
        this.error = error.message || "Failed to complete course";
        console.error(this.error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    // Fetch leaderboard
    async fetchLeaderboard(limit: number = 10) {
      this.loading = true;
      this.error = "";

      try {
        const response = await useNuxtApp().$api<LeaderboardEntry[]>(`/leaderboard?limit=${limit}`, { method: "GET" });

        this.leaderboard = response;
        return response;
      } catch (error: any) {
        this.error = error.message || "Failed to fetch leaderboard";
        console.error(this.error);
        return [];
      } finally {
        this.loading = false;
      }
    },

    // Fetch daily streak information
    async fetchDailyStreak() {
      this.loading = true;
      this.error = "";

      try {
        const response = await useNuxtApp().$api<DailyStreakInfo>(`/stats/daily-streak`, {
          method: "GET",
        });

        this.dailyStreak = response;
        return response;
      } catch (error: any) {
        this.error = error.message || "Failed to fetch daily streak";
        console.error(this.error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    // Fetch accuracy statistics
    async fetchAccuracyStats() {
      this.loading = true;
      this.error = "";

      try {
        const response = await useNuxtApp().$api<AccuracyStats>(`/stats/accuracy`, {
          method: "GET",
        });

        this.accuracyStats = response;
        return response;
      } catch (error: any) {
        this.error = error.message || "Failed to fetch accuracy stats";
        console.error(this.error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    // Clear points data (for logout)
    clearPointsData() {
      this.summary = null;
      this.lessonPoints = {};
      this.leaderboard = [];
      this.dailyStreak = null;
      this.accuracyStats = null;
      this.error = "";
    },
  },
});
