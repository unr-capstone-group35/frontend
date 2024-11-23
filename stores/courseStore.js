import { defineStore } from 'pinia'

export const useCourseStore = defineStore('course', {
  state: () => ({
    selectedCourse: null,
    courses: {
      'cs-basics': {
        id: 'cs-basics',  // Changed to match courseId
        name: "Computer Science Basics",
        description: "Master the fundamental concepts of computer science and programming",
        steps: [
          { title: "Learn Variables", description: "Understand variables, their types, and initialization." },
          { title: "Learn Control Structures", description: "Understand conditionals, loops, and basic logic." },
          { title: "Learn Functions", description: "Learn how to write functions and organize code." },
        ]
      },
      'data-structures': {
        id: 'data-structures',  // Changed to match courseId
        name: "Data Structures",
        description: "Dive deep into essential data structures that power modern software",
        steps: [
          { title: "Learn Arrays", description: "Understand arrays, their structure, and operations." },
          { title: "Learn Linked Lists", description: "Understand linked lists and their implementation." },
          { title: "Learn Stacks", description: "Learn about stacks and their applications." },
          { title: "Learn Queues", description: "Understand queues and their use cases." },
          { title: "Learn Trees", description: "Learn about tree data structures like binary trees." },
        ]
      },
      'algorithms': {
        id: 'algorithms',  // Changed to match courseId
        name: "Algorithms",
        description: "Master the art of problem-solving with algorithms",
        steps: [
          { title: "Sorting Algorithms", description: "Learn basic sorting algorithms like Bubble Sort." },
          { title: "Searching Algorithms", description: "Understand searching algorithms like Binary Search." },
          { title: "Divide and Conquer", description: "Learn about divide and conquer strategies." },
          { title: "Dynamic Programming", description: "Explore dynamic programming techniques." },
        ]
      }
    }
  }),
  actions: {
    selectCourse(courseId) {
      // Set the entire course object as selectedCourse
      this.selectedCourse = this.courses[courseId]
    }
  }
})