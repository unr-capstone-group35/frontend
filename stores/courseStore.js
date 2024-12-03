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
            title: "Learn Variables", 
            description: "Understand variables, their types, and initialization.",
            lessonId: "variables",
            exerciseId: "1"
          },
          { 
            title: "Learn Control Structures", 
            description: "Understand conditionals, loops, and basic logic.",
            lessonId: "control-structures",
            exerciseId: "1"
          },
          { 
            title: "Learn Functions", 
            description: "Learn how to write functions and organize code.",
            lessonId: "functions",
            exerciseId: "1"
          }
        ]
      },

      'data-structures': {
        id: 'data-structures',
        name: "Data Structures",
        description: "Dive deep into essential data structures that power modern software",
        steps: [
          { 
            title: "Learn Arrays", 
            description: "Understand arrays, their structure, and operations.",
            lessonId: "arrays",
            exerciseId: "1"
          },
          { 
            title: "Learn Linked Lists", 
            description: "Understand linked lists and their implementation.",
            lessonId: "linked-lists",
            exerciseId: "1"
          },
          { 
            title: "Learn Stacks", 
            description: "Learn about stacks and their applications.",
            lessonId: "stacks",
            exerciseId: "1"
          },
          { 
            title: "Learn Queues", 
            description: "Understand queues and their use cases.",
            lessonId: "queues",
            exerciseId: "1"
          },
          { 
            title: "Learn Trees", 
            description: "Learn about tree data structures like binary trees.",
            lessonId: "trees",
            exerciseId: "1"
          }
        ]
      },

      'algorithms': {
        id: 'algorithms',
        name: "Algorithms",
        description: "Master the art of problem-solving with algorithms",
        steps: [
          { 
            title: "Sorting Algorithms", 
            description: "Learn basic sorting algorithms like Bubble Sort.",
            lessonId: "sorting",
            exerciseId: "1"
          },
          { 
            title: "Searching Algorithms", 
            description: "Understand searching algorithms like Binary Search.",
            lessonId: "searching",
            exerciseId: "1"
          },
          { 
            title: "Divide and Conquer", 
            description: "Learn about divide and conquer strategies.",
            lessonId: "divide-conquer",
            exerciseId: "1"
          },
          { 
            title: "Dynamic Programming", 
            description: "Explore dynamic programming techniques.",
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