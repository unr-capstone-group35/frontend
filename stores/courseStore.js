// moving to backend soon
import { defineStore } from 'pinia'

export const useCourseStore = defineStore('course', {
  state: () => ({
    selectedCourse: null,
    courses: {
      'cs-basics': {
        id: 'cs-basics',
        name: "Computer Science Basics",
        description: "Master the fundamental concepts of computer science and programming",
        steps: [
          {
            title: "Introduction",
            description: "Overview of programming basics concepts",
            lessonId: "introduction",
            exerciseId: "1"
          },
          {
            title: "Variables",
            description: "Understand how to store and manipulate data",
            lessonId: "variables",
            exerciseId: "1"
          },
          {
            title: "Functions",
            description: "Learn to create reusable blocks of code",
            lessonId: "functions",
            exerciseId: "1"
          },
          {
            title: "Conditional Statements",
            description: "Master decision-making in programming",
            lessonId: "conditionals",
            exerciseId: "1"
          },
          {
            title: "Loops",
            description: "Understand how to repeat actions efficiently",
            lessonId: "loops",
            exerciseId: "1"
          },
          {
            title: "Practice",
            description: "Apply everything you've learned so far",
            lessonId: "practice",
            exerciseId: "1"
          }
        ]
      },

      'data-structures': {
        id: 'data-structures',
        name: "Data Structures",
        description: "Master fundamental data structures used in programming",
        steps: [
          {
            title: "Introduction",
            description: "Overview of data structures and their importance",
            lessonId: "introduction",
            exerciseId: "1"
          },
          {
            title: "Arrays",
            description: "Learn about static and dynamic arrays",
            lessonId: "arrays",
            exerciseId: "1"
          },
          {
            title: "Linked Lists",
            description: "Understand linked lists and their operations",
            lessonId: "linked-lists",
            exerciseId: "1"
          },
          {
            title: "Stacks",
            description: "Master the stack data structure and its applications",
            lessonId: "stacks",
            exerciseId: "1"
          },
          {
            title: "Queues",
            description: "Learn about queue structures and their uses",
            lessonId: "queues",
            exerciseId: "1"
          },
          {
            title: "Trees",
            description: "Explore tree structures and their implementations",
            lessonId: "trees",
            exerciseId: "1"
          },
          {
            title: "Graphs",
            description: "Understand graph structures and their applications",
            lessonId: "graphs",
            exerciseId: "1"
          }
        ]
      },

      'algorithms': {
        id: 'algorithms',
        name: "Algorithms",
        description: "Learn essential algorithms and problem-solving techniques",
        steps: [
          {
            title: "Introduction",
            description: "Overview of algorithms and their analysis",
            lessonId: "introduction",
            exerciseId: "1"
          },
          {
            title: "Time Complexity",
            description: "Understand how to analyze algorithm efficiency",
            lessonId: "time-complexity",
            exerciseId: "1"
          },
          {
            title: "Searching Algorithms",
            description: "Master different searching techniques",
            lessonId: "searching",
            exerciseId: "1"
          },
          {
            title: "Sorting Algorithms",
            description: "Learn various sorting methods and their applications",
            lessonId: "sorting",
            exerciseId: "1"
          },
          {
            title: "Recursion",
            description: "Understand recursive problem-solving approaches",
            lessonId: "recursion",
            exerciseId: "1"
          },
          {
            title: "Divide & Conquer",
            description: "Learn to break down complex problems",
            lessonId: "divide-conquer",
            exerciseId: "1"
          },
          {
            title: "Dynamic Programming",
            description: "Master optimization through dynamic programming",
            lessonId: "dynamic-programming",
            exerciseId: "1"
          }
        ]
      }
    }
  }),

  actions: {
    selectCourse(courseId) {
      this.selectedCourse = this.courses[courseId]
    }
  }
  
})