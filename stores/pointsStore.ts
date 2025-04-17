// Update the existing pointsStore.ts with new functionality
import { defineStore } from 'pinia'

export type PointTransaction = {
  id: number
  userId: number
  courseId: string
  lessonId: string
  exerciseId?: string
  transactionType: string
  points: number
  description: string
  createdAt: string
}

export type PointsSummary = {
  totalPoints: number
  currentStreak: number
  maxStreak: number
  recentTransactions?: PointTransaction[]
}

export type LessonPointsData = {
  courseId: string
  lessonId: string
  totalPoints: number
  currentStreak: number
  maxStreak: number
}

export type ExercisePointsResult = {
  isCorrect: boolean
  points: number
  transaction?: PointTransaction
  currentStreak: number
  maxStreak: number
}

export type LeaderboardEntry = {
  userId: number
  username: string
  totalPoints: number
  profilePicture?: string
  rank: number
}

export const usePointsStore = defineStore('points', {
  state: () => ({
    summary: null as PointsSummary | null,
    lessonPoints: {} as Record<string, LessonPointsData>,
    leaderboard: [] as LeaderboardEntry[],
    loading: false,
    error: ''
  }),

  getters: {
    // Get total points for the user
    totalPoints: (state): number => {
      return state.summary?.totalPoints || 0
    },

    // Get current streak across all lessons
    currentStreak: (state): number => {
      return state.summary?.currentStreak || 0
    },

    // Get max streak
    maxStreak: (state): number => {
      return state.summary?.maxStreak || 0
    },

    // Get recent transactions
    recentTransactions: (state): PointTransaction[] => {
      return state.summary?.recentTransactions || []
    },
    
    // Get points for a specific lesson
    getLessonPoints: (state) => (courseId: string, lessonId: string): LessonPointsData | null => {
      const key = `${courseId}-${lessonId}`
      return state.lessonPoints[key] || null
    },
    
    // Get lesson streak
    getLessonStreak: (state) => (courseId: string, lessonId: string): number => {
      const key = `${courseId}-${lessonId}`
      return state.lessonPoints[key]?.currentStreak || 0
    }
  },

  actions: {
    // Fetch points summary
    async fetchPointsSummary(limit: number = 5) {
      this.loading = true
      this.error = ''
      
      try {
        const response = await useNuxtApp().$api<PointsSummary>(
          `http://localhost:8080/api/points/summary?limit=${limit}`,
          { method: 'GET' }
        )
        
        this.summary = response
        return response
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch points summary'
        console.error(this.error)
        return null
      } finally {
        this.loading = false
      }
    },
    
    // Fetch points for a specific lesson
    async fetchLessonPoints(courseId: string, lessonId: string) {
      this.loading = true
      this.error = ''
      
      try {
        const response = await useNuxtApp().$api<LessonPointsData>(
          `http://localhost:8080/api/courses/${courseId}/lessons/${lessonId}/points`,
          { method: 'GET' }
        )
        
        const key = `${courseId}-${lessonId}`
        this.lessonPoints[key] = response
        return response
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch lesson points'
        console.error(this.error)
        return null
      } finally {
        this.loading = false
      }
    },
    
    // Submit exercise attempt with points
    async submitExerciseAttempt(courseId: string, lessonId: string, exerciseId: string, answer: any) {
      this.loading = true
      this.error = ''
      
      try {
        const response = await useNuxtApp().$api<ExercisePointsResult>(
          `http://localhost:8080/api/courses/${courseId}/lessons/${lessonId}/exercises/${exerciseId}/points`,
          { 
            method: 'POST',
            body: JSON.stringify({ answer })
          }
        )
        
        // Refresh data after submission
        await this.fetchLessonPoints(courseId, lessonId)
        
        return response
      } catch (error: any) {
        this.error = error.message || 'Failed to submit exercise'
        console.error(this.error)
        return null
      } finally {
        this.loading = false
      }
    },
    
    // Complete a lesson with points
    async completeLesson(courseId: string, lessonId: string) {
      this.loading = true
      this.error = ''
      
      try {
        const response = await useNuxtApp().$api<PointTransaction>(
          `http://localhost:8080/api/courses/${courseId}/lessons/${lessonId}/complete`,
          { method: 'POST' }
        )
        
        // Refresh data after completion
        await this.fetchLessonPoints(courseId, lessonId)
        await this.fetchPointsSummary()
        
        return response
      } catch (error: any) {
        this.error = error.message || 'Failed to complete lesson'
        console.error(this.error)
        return null
      } finally {
        this.loading = false
      }
    },
    
    // Complete a course with points
    async completeCourse(courseId: string) {
      this.loading = true
      this.error = ''
      
      try {
        const response = await useNuxtApp().$api<PointTransaction>(
          `http://localhost:8080/api/courses/${courseId}/complete`,
          { method: 'POST' }
        )
        
        // Refresh points summary after completion
        await this.fetchPointsSummary()
        
        return response
      } catch (error: any) {
        this.error = error.message || 'Failed to complete course'
        console.error(this.error)
        return null
      } finally {
        this.loading = false
      }
    },
    
    // Fetch leaderboard
    async fetchLeaderboard(limit: number = 10) {
      this.loading = true
      this.error = ''
      
      try {
        const response = await useNuxtApp().$api<LeaderboardEntry[]>(
          `http://localhost:8080/api/leaderboard?limit=${limit}`,
          { method: 'GET' }
        )
        
        this.leaderboard = response
        return response
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch leaderboard'
        console.error(this.error)
        return []
      } finally {
        this.loading = false
      }
    },
    
    // Clear points data (useful for logout)
    clearPointsData() {
      this.summary = null
      this.lessonPoints = {}
      this.leaderboard = []
      this.error = ''
    }
  }
})