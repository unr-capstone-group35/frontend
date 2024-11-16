import { defineStore } from 'pinia'

export const useCourseStore = defineStore('course', {
  state: () => ({
    selectedCourse: null,
    courses: {
      'cs-basics': {
        id: 1,
        name: "Computer Science Basics",
        description: "Master the fundamental concepts of computer science and programming",
        steps: [
          { title: "Step 1: Learn Variables", description: "Understand variables, their types, and initialization." },
          { title: "Step 2: Learn Control Structures", description: "Understand loops, conditionals, and basic logic." },
          { title: "Step 3: Learn Functions", description: "Learn how to write functions and organize code." },
        ]
      },
      'data-structures': {
        id: 2,
        name: "Data Structures",
        description: "Dive deep into essential data structures that power modern software",
        steps: [
          { title: "Step 1: Learn Arrays", description: "Understand arrays, their structure, and operations." },
          { title: "Step 2: Learn Linked Lists", description: "Understand linked lists and their implementation." },
          { title: "Step 3: Learn Stacks", description: "Learn about stacks and their applications." },
          { title: "Step 4: Learn Queues", description: "Understand queues and their use cases." },
          { title: "Step 5: Learn Trees", description: "Learn about tree data structures like binary trees." },
        ]
      },
      'algorithms': {
        id: 3,
        name: "Algorithms",
        description: "Master the art of problem-solving with algorithms",
        steps: [
          { title: "Step 1: Sorting Algorithms", description: "Learn basic sorting algorithms like Bubble Sort." },
          { title: "Step 2: Searching Algorithms", description: "Understand searching algorithms like Binary Search." },
          { title: "Step 3: Divide and Conquer", description: "Learn about divide and conquer strategies." },
          { title: "Step 4: Dynamic Programming", description: "Explore dynamic programming techniques." },
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

