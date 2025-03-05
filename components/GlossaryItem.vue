<template>
  <div
    class="min-h-page flex-1 overflow-y-auto bg-gradient-to-b from-slate-100 to-slate-200 p-8 transition-all duration-300 dark:from-gray-950 dark:to-gray-900"
  >
    <div class="relative mx-auto max-w-[900px] p-6 font-sans">
      <h1 class="mb-6 text-center text-4xl font-bold !text-emerald-500">📚 Programming Glossary</h1>
      <div class="mb-4 flex items-center justify-between">
        <div class="relative max-w-[700px] flex-grow">
          <div class="search-icon">🔍</div>
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Search terms..."
            class="w-full rounded-lg border border-gray-300 bg-white px-9 py-2.5 text-base text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <button
            v-if="searchTerm"
            @click="searchTerm = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer border-none bg-transparent p-0 text-base text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <!-- Toggle view mode -->
        <div class="ml-4 flex">
          <button
            @click="toggleView('compact')"
            :class="['view-btn', { active: viewMode === 'compact' }]"
            title="Compact View"
          >
            <span>☰</span>
          </button>
          <button @click="toggleView('card')" :class="['view-btn', { active: viewMode === 'card' }]" title="Card View">
            <span>☷</span>
          </button>
        </div>
      </div>

      <!-- Category filter tabs -->
      <div class="mb-5 flex gap-2 overflow-x-auto pb-2">
        <button
          @click="setActiveCategory('All')"
          :class="[
            'cursor-pointer whitespace-nowrap rounded-md border px-4 py-2 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700',
            activeCategory === 'All'
              ? 'border-teal-800 bg-teal-800 text-white'
              : 'border-gray-300 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white'
          ]"
        >
          All
        </button>

        <button
          @click="setActiveCategory('Basics')"
          :class="[
            'cursor-pointer whitespace-nowrap rounded-md border px-4 py-2 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700',
            activeCategory === 'Basics'
              ? 'border-emerald-500 bg-emerald-500 text-white'
              : 'border-gray-300 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white'
          ]"
        >
          Basics
        </button>

        <button
          @click="setActiveCategory('Data Structures')"
          :class="[
            'cursor-pointer whitespace-nowrap rounded-md border px-4 py-2 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700',
            activeCategory === 'Data Structures'
              ? 'border-blue-700 bg-blue-700 text-white'
              : 'border-gray-300 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white'
          ]"
        >
          Data Structures
        </button>

        <button
          @click="setActiveCategory('Algorithms')"
          :class="[
            'cursor-pointer whitespace-nowrap rounded-md border px-4 py-2 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700',
            activeCategory === 'Algorithms'
              ? 'border-red-700 bg-red-700 text-white'
              : 'border-gray-300 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white'
          ]"
        >
          Algorithms
        </button>
      </div>

      <div v-if="viewMode === 'compact'">
        <!-- Glossary items -->
        <div
          v-for="(item, index) in filteredGlossaryItems"
          :key="index"
          class="mb-4 overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <div class="flex items-center border-b border-gray-200 p-4 dark:border-gray-700">
            <div class="w-[120px] min-w-[120px] pr-4">
              <div class="pl-0.5 font-semibold text-gray-800 dark:text-white">{{ item.term }}</div>
            </div>
            <div class="flex-grow px-2 pr-6 text-gray-600 dark:text-gray-300">{{ item.definition }}</div>
            <div class="flex w-[120px] min-w-[120px] items-center justify-end gap-3 pr-2">
              <span
                :class="[
                  'whitespace-nowrap rounded px-1.5 py-0.5 text-xs',
                  item.category === 'Basics'
                    ? 'bg-emerald-500 text-white'
                    : item.category === 'Data Structures'
                      ? 'bg-blue-700 text-white'
                      : 'bg-red-700 text-white'
                ]"
                >{{ item.category === "Data Structures" ? "Data Structs" : item.category }}</span
              >
              <button @click="toggleExample(index)" class="toggle-btn" :class="{ active: item.isExampleVisible }">
                <span class="toggle-arrow">{{ item.isExampleVisible ? "▲" : "▼" }}</span>
              </button>
            </div>
          </div>
          <div
            v-if="item.isExampleVisible"
            class="border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700"
          >
            <div class="mb-4 overflow-hidden rounded bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-200">
              <div
                class="flex items-center justify-between border-b border-gray-300 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
              >
                <span>Example</span>
                <button @click="copyToClipboard(item.example)" class="copy-btn" title="Copy to clipboard">📋</button>
              </div>
              <pre class="code-pre"><code>{{ item.example }}</code></pre>
            </div>
            <div v-if="item.explanation" class="mb-4 rounded bg-white p-3 dark:bg-gray-800">
              <h4 class="mb-2 mt-0 text-sm text-gray-800 dark:text-white">Explanation:</h4>
              <p class="m-0 text-sm leading-6 text-gray-600 dark:text-gray-300">{{ item.explanation }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Card view mode -->
      <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(item, index) in filteredGlossaryItems"
          :key="index"
          class="flex h-full flex-col overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <div class="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
            <h3 class="m-0 text-lg text-gray-800 dark:text-white">{{ item.term }}</h3>
            <span
              :class="[
                'rounded px-1.5 py-0.5 text-xs',
                item.category === 'Basics'
                  ? 'bg-emerald-500 text-white'
                  : item.category === 'Data Structures'
                    ? 'bg-blue-700 text-white'
                    : 'bg-red-700 text-white'
              ]"
              >{{ item.category === "Data Structures" ? "Data Structs" : item.category }}</span
            >
          </div>
          <div class="flex flex-grow flex-col p-4">
            <p class="mb-4 mt-0 flex-grow text-gray-600 dark:text-gray-300">{{ item.definition }}</p>
            <div class="mb-4 flex items-center">
              <button @click="toggleExample(index)" class="toggle-btn" :class="{ active: item.isExampleVisible }">
                {{ item.isExampleVisible ? "Hide" : "Show" }}
              </button>
            </div>
            <div v-if="item.isExampleVisible" class="mt-4 border-t border-gray-300 pt-4 dark:border-gray-600">
              <div class="mb-4 overflow-hidden rounded bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                <div
                  class="flex items-center justify-between border-b border-gray-300 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                >
                  <span>Example</span>
                  <button @click="copyToClipboard(item.example)" class="copy-btn" title="Copy to clipboard">📋</button>
                </div>
                <pre class="code-pre"><code>{{ item.example }}</code></pre>
              </div>
              <div v-if="item.explanation" class="mb-4 rounded bg-white p-3 dark:bg-gray-800">
                <h4 class="mb-2 mt-0 text-sm text-gray-800 dark:text-white">Explanation:</h4>
                <p class="m-0 text-sm leading-6 text-gray-600 dark:text-gray-300">{{ item.explanation }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state when no results -->
      <div v-if="filteredGlossaryItems.length === 0" class="py-10 text-center text-gray-500 dark:text-gray-400">
        <p>No matching terms found. Try adjusting your search.</p>
      </div>

      <!-- Result stats -->
      <div class="mt-6 text-center text-sm text-gray-500 dark:text-gray-500">
        <p>Showing {{ filteredGlossaryItems.length }} of {{ glossaryItems.length }} terms</p>
      </div>

      <div v-if="showCopyNotification" class="copy-notification">Copied to clipboard!</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue"

const viewMode = ref("compact") // 'compact' or 'card' view mode

// Categories
const categories = ["All", "Basics", "Data Structures", "Algorithms"]
const activeCategory = ref("All")

// Search
const searchTerm = ref("")

// Copy notification
const showCopyNotification = ref(false)

// Glossary data
const glossaryItems = ref([
  // terms for prototype(mix of all 3)
  {
    term: "Variable",
    definition:
      "A named storage location in a program's memory that holds a value which can be modified during program execution.",
    example: "foo = 42",
    explanation: 'In this example, "foo" is the variable name and 42 is the value assigned to it.',
    category: "Basics",
    isExampleVisible: false
  },
  {
    term: "Function",
    definition:
      "A reusable block of code that performs a specific task when called and can accept inputs and return outputs.",
    example: "function add(a, b) {\n  return a + b;\n}",
    explanation: 'This function named "add" takes two parameters (a and b) and returns their sum.',
    category: "Basics",
    isExampleVisible: false
  },
  {
    term: "Array",
    definition: "A data structure consisting of a collection of elements, each identified by an index.",
    example: "numbers = [1, 2, 3, 4, 5]",
    explanation: 'This creates an array called "numbers" containing five integer elements.',
    category: "Data Structures",
    isExampleVisible: false
  },
  {
    term: "Object",
    definition: "A collection of key-value pairs that represent properties and their values.",
    example: 'person = {\n  name: "John",\n  age: 30\n}',
    explanation: 'This object has two properties: "name" with value "John" and "age" with value 30.',
    category: "Data Structures",
    isExampleVisible: false
  },
  {
    term: "Recursion",
    definition: "A programming technique where a function calls itself to solve a problem.",
    example: "function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n-1);\n}",
    explanation:
      "This recursive function calculates the factorial of a number by calling itself with a smaller input until it reaches the base case.",
    category: "Algorithms",
    isExampleVisible: false
  },
  // additional basics
  {
    term: "Program",
    definition: "A set of instructions written in a programming language that tells a computer what tasks to perform.",
    example: "console.log('Hello, World!');",
    explanation: "This simple program outputs the text 'Hello, World!' to the console.",
    category: "Basics",
    isExampleVisible: false
  },
  {
    term: "Bug",
    definition:
      "An error or flaw in a program that causes it to produce incorrect results or behave in unintended ways.",
    example: "let total = 5;\ntotal = total + '5'; // Becomes '55' instead of 10",
    explanation: "This bug occurs because the '+' operator with a string performs concatenation instead of addition.",
    category: "Basics",
    isExampleVisible: false
  },
  {
    term: "Debug",
    definition: "The process of finding and resolving bugs or errors in a program.",
    example: "console.log('Value:', myVariable); // Check current value",
    explanation: "Using console.log to inspect variables is a common debugging technique.",
    category: "Basics",
    isExampleVisible: false
  },
  {
    term: "Code",
    definition: "Text written in a programming language that specifies what actions a computer should perform.",
    example: "let message = 'Hello';\nconsole.log(message);",
    explanation: "This code creates a variable and then displays its value in the console.",
    category: "Basics",
    isExampleVisible: false
  },
  {
    term: "Integer",
    definition: "A data type that represents whole numbers without any decimal or fractional parts.",
    example: "let age = 25;",
    explanation: "The variable 'age' is assigned an integer value of 25.",
    category: "Basics",
    isExampleVisible: false
  },
  {
    term: "String",
    definition: "A data type that represents a sequence of characters, typically enclosed in quotes.",
    example: 'let greeting = "Hello, world!";',
    explanation: "The variable 'greeting' contains a string of 13 characters.",
    category: "Basics",
    isExampleVisible: false
  },
  {
    term: "Boolean",
    definition: "A data type with only two possible values: true or false.",
    example: "let isActive = true;\nlet isComplete = false;",
    explanation: "The variables store boolean values that can be used in conditional statements.",
    category: "Basics",
    isExampleVisible: false
  },
  {
    term: "Conditional Statement",
    definition:
      "A programming structure that performs different actions based on whether a condition evaluates to true or false.",
    example: "if (age >= 18) {\n  console.log('Adult');\n} else {\n  console.log('Minor');\n}",
    explanation: "This code checks if the age is at least 18 and outputs either 'Adult' or 'Minor' accordingly.",
    category: "Basics",
    isExampleVisible: false
  },
  {
    term: "Loop",
    definition: "A programming structure that repeats a sequence of instructions until a specific condition is met.",
    example: "for (let i = 0; i < 3; i++) {\n  console.log(i);\n}",
    explanation: "This for loop outputs the numbers 0, 1, and 2 by repeating the code block three times.",
    category: "Basics",
    isExampleVisible: false
  },
  {
    term: "For Loop",
    definition:
      "A control flow statement that iterates a specific number of times, based on a counter and a condition.",
    example: "for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}",
    explanation: "This loop counts from 1 to 5, printing each number to the console.",
    category: "Basics",
    isExampleVisible: false
  },
  {
    term: "While Loop",
    definition: "A control flow statement that executes a block of code as long as a specified condition is true.",
    example: "let i = 0;\nwhile (i < 3) {\n  console.log(i);\n  i++;\n}",
    explanation: "This while loop outputs 0, 1, and 2, continuing until i is no longer less than 3.",
    category: "Basics",
    isExampleVisible: false
  },
  // Data Structures
  {
    term: "Data Structure",
    definition:
      "A specialized format for organizing, processing, retrieving and storing data to suit particular purposes.",
    example: "// Examples include arrays, linked lists, stacks, etc.\nlet array = [1, 2, 3];\nlet map = new Map();",
    explanation:
      "This example shows two common data structures: an array for sequential data and a Map for key-value pairs.",
    category: "Data Structures",
    isExampleVisible: false
  },
  {
    term: "Linked List",
    definition:
      "A linear data structure where elements are stored in nodes, with each node containing data and a reference to the next node.",
    example:
      "class Node {\n  constructor(data) {\n    this.data = data;\n    this.next = null;\n  }\n}\n\nlet head = new Node(1);\nhead.next = new Node(2);",
    explanation: "This creates a simple linked list with two nodes containing values 1 and 2.",
    category: "Data Structures",
    isExampleVisible: false
  },
  {
    term: "Stack",
    definition:
      "A linear data structure that follows the Last-In-First-Out (LIFO) principle, where elements are added and removed from the same end.",
    example:
      "let stack = [];\n\n// Push elements\nstack.push(1);\nstack.push(2);\n\n// Pop element\nlet top = stack.pop(); // Returns 2",
    explanation: "Using an array as a stack: elements are pushed onto the top and popped off in reverse order.",
    category: "Data Structures",
    isExampleVisible: false
  },
  {
    term: "Queue",
    definition:
      "A linear data structure that follows the First-In-First-Out (FIFO) principle, where elements are added at the rear and removed from the front.",
    example:
      "let queue = [];\n\n// Enqueue elements\nqueue.push(1);\nqueue.push(2);\n\n// Dequeue element\nlet front = queue.shift(); // Returns 1",
    explanation: "Using an array as a queue: elements are added to the end and removed from the front.",
    category: "Data Structures",
    isExampleVisible: false
  },
  {
    term: "Tree",
    definition:
      "A hierarchical data structure consisting of nodes, with a root node and subtrees of children nodes, representing parent-child relationships.",
    example:
      "class TreeNode {\n  constructor(value) {\n    this.value = value;\n    this.left = null;\n    this.right = null;\n  }\n}\n\nlet root = new TreeNode(1);\nroot.left = new TreeNode(2);\nroot.right = new TreeNode(3);",
    explanation: "This creates a simple binary tree with a root node (1) and two child nodes (2 and 3).",
    category: "Data Structures",
    isExampleVisible: false
  },
  {
    term: "Binary Tree",
    definition:
      "A tree data structure in which each node has at most two children, referred to as left child and right child.",
    example:
      "class Node {\n  constructor(data) {\n    this.data = data;\n    this.left = null;\n    this.right = null;\n  }\n}",
    explanation: "This defines a node in a binary tree, where each node can have up to two children.",
    category: "Data Structures",
    isExampleVisible: false
  },
  {
    term: "Graph",
    definition:
      "A non-linear data structure consisting of vertices (or nodes) connected by edges, representing relationships between objects.",
    example:
      "// Adjacency list representation\nlet graph = {\n  A: ['B', 'C'],\n  B: ['A', 'D'],\n  C: ['A', 'D'],\n  D: ['B', 'C']\n};",
    explanation: "This example shows a simple undirected graph with 4 vertices (A, B, C, D) using an adjacency list.",
    category: "Data Structures",
    isExampleVisible: false
  },
  {
    term: "Array Index",
    definition:
      "A numeric position that identifies an element's location within an array, starting from zero for the first element.",
    example:
      "let fruits = ['apple', 'banana', 'cherry'];\nlet firstFruit = fruits[0]; // 'apple'\nlet lastFruit = fruits[2]; // 'cherry'",
    explanation: "Accessing array elements using their index: 0 for the first element, 1 for the second, and so on.",
    category: "Data Structures",
    isExampleVisible: false
  },
  {
    term: "Dynamic Array",
    definition:
      "An array that can resize itself automatically when elements are added or removed, allowing for flexible storage.",
    example:
      "let dynamicArray = [];\n\n// Add elements beyond initial capacity\nfor (let i = 0; i < 10; i++) {\n  dynamicArray.push(i);\n}",
    explanation: "JavaScript arrays are dynamic by default, automatically resizing when new elements are added.",
    category: "Data Structures",
    isExampleVisible: false
  },
  {
    term: "Vertex",
    definition: "A fundamental unit or node in a graph data structure that represents an entity or point.",
    example: "// Graph with vertices A, B, C\nlet graph = {\n  A: [],\n  B: [],\n  C: []\n};",
    explanation: "This example defines a graph with three vertices but no connections between them yet.",
    category: "Data Structures",
    isExampleVisible: false
  },
  {
    term: "Edge",
    definition: "A connection between two vertices in a graph that represents a relationship or link.",
    example: "// Adding edges to connect vertices\ngraph.A.push('B'); // A -> B\ngraph.B.push('A'); // B -> A",
    explanation: "This adds a bidirectional edge between vertices A and B in the graph.",
    category: "Data Structures",
    isExampleVisible: false
  },
  //Algorithms
  {
    term: "Algorithm",
    definition: "A step-by-step procedure or set of rules for solving a specific problem or performing a computation.",
    example:
      "function binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n  \n  while (left <= right) {\n    let mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}",
    explanation: "This binary search algorithm efficiently finds a target value in a sorted array.",
    category: "Algorithms",
    isExampleVisible: false
  },
  {
    term: "Time Complexity",
    definition: "A measure of the amount of time an algorithm takes to run as a function of the length of the input.",
    example:
      "// O(n) - Linear Time\nfunction findMax(arr) {\n  let max = arr[0];\n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] > max) max = arr[i];\n  }\n  return max;\n}",
    explanation: "This function runs in O(n) time because it examines each element in the array exactly once.",
    category: "Algorithms",
    isExampleVisible: false
  },
  {
    term: "Space Complexity",
    definition: "A measure of the amount of memory an algorithm uses relative to the size of the input.",
    example:
      "// O(n) space complexity\nfunction createDoubles(arr) {\n  let result = [];\n  for (let i = 0; i < arr.length; i++) {\n    result.push(arr[i] * 2);\n  }\n  return result;\n}",
    explanation:
      "This function has O(n) space complexity because it creates a new array proportional to the input size.",
    category: "Algorithms",
    isExampleVisible: false
  },
  {
    term: "Big O Notation",
    definition:
      "A mathematical notation that describes the limiting behavior of a function when the argument tends towards a particular value or infinity.",
    example:
      "// O(1) - Constant time\nfunction getFirst(arr) {\n  return arr[0];\n}\n\n// O(n) - Linear time\nfunction sum(arr) {\n  let total = 0;\n  for (let num of arr) total += num;\n  return total;\n}",
    explanation:
      "Big O notation classifies algorithms by their efficiency: O(1) is constant time, O(n) is linear time, and so on.",
    category: "Algorithms",
    isExampleVisible: false
  },
  {
    term: "Binary Search",
    definition:
      "A search algorithm that finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.",
    example:
      "function binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n  \n  while (left <= right) {\n    let mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}",
    explanation:
      "Binary search operates on a sorted array and has O(log n) time complexity, making it much faster than linear search for large datasets.",
    category: "Algorithms",
    isExampleVisible: false
  },
  {
    term: "Linear Search",
    definition:
      "A simple search algorithm that checks each element of a list sequentially until a match is found or the entire list has been searched.",
    example:
      "function linearSearch(arr, target) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) return i;\n  }\n  return -1;\n}",
    explanation: "Linear search has O(n) time complexity and works on both sorted and unsorted arrays.",
    category: "Algorithms",
    isExampleVisible: false
  },
  {
    term: "Bubble Sort",
    definition:
      "A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.",
    example:
      "function bubbleSort(arr) {\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = 0; j < arr.length - i - 1; j++) {\n      if (arr[j] > arr[j + 1]) {\n        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n      }\n    }\n  }\n  return arr;\n}",
    explanation: "Bubble sort has O(n²) time complexity in the worst case, making it inefficient for large datasets.",
    category: "Algorithms",
    isExampleVisible: false
  },
  {
    term: "Merge Sort",
    definition:
      "A divide-and-conquer sorting algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves.",
    example:
      "function mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  \n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n  \n  return merge(left, right);\n}",
    explanation:
      "Merge sort has O(n log n) time complexity, making it efficient for large datasets, though it requires additional space.",
    category: "Algorithms",
    isExampleVisible: false
  },
  {
    term: "Quick Sort",
    definition:
      "A divide-and-conquer sorting algorithm that selects a 'pivot' element and partitions the array around it, then recursively sorts the sub-arrays.",
    example:
      "function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  \n  const pivot = arr[0];\n  const left = [];\n  const right = [];\n  \n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] < pivot) left.push(arr[i]);\n    else right.push(arr[i]);\n  }\n  \n  return [...quickSort(left), pivot, ...quickSort(right)];\n}",
    explanation: "Quick sort has an average time complexity of O(n log n) but can degrade to O(n²) in the worst case.",
    category: "Algorithms",
    isExampleVisible: false
  },
  {
    term: "Recursion",
    definition:
      "A problem-solving approach where a function calls itself to solve smaller instances of the same problem.",
    example:
      "function factorial(n) {\n  // Base case\n  if (n <= 1) return 1;\n  \n  // Recursive case\n  return n * factorial(n - 1);\n}",
    explanation:
      "This factorial function uses recursion with a base case (n <= 1) and a recursive case that calls itself with a smaller input.",
    category: "Algorithms",
    isExampleVisible: false
  },
  {
    term: "Divide and Conquer",
    definition:
      "An algorithmic paradigm that breaks a problem into smaller subproblems, solves each subproblem independently, and combines their solutions.",
    example:
      "// Merge sort is a classic divide and conquer algorithm\nfunction mergeSort(arr) {\n  // Base case: arrays of length 0 or 1 are sorted\n  if (arr.length <= 1) return arr;\n  \n  // Divide the problem\n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n  \n  // Combine the solutions\n  return merge(left, right);\n}",
    explanation:
      "Divide and conquer breaks down problems into manageable parts, often using recursion, and is the basis for efficient algorithms like merge sort.",
    category: "Algorithms",
    isExampleVisible: false
  },
  {
    term: "Dynamic Programming",
    definition:
      "A method for solving complex problems by breaking them down into simpler subproblems and storing their solutions to avoid redundant calculations.",
    example:
      "// Fibonacci using dynamic programming\nfunction fibonacci(n) {\n  const memo = [0, 1];\n  \n  for (let i = 2; i <= n; i++) {\n    memo[i] = memo[i-1] + memo[i-2];\n  }\n  \n  return memo[n];\n}",
    explanation:
      "This function efficiently calculates Fibonacci numbers by storing previously computed values, avoiding the exponential time complexity of naive recursion.",
    category: "Algorithms",
    isExampleVisible: false
  },
  {
    term: "Memoization",
    definition:
      "An optimization technique used primarily in dynamic programming where results of expensive function calls are stored and reused when the same inputs occur again.",
    example:
      "function fibMemo(n, memo = {}) {\n  // Check if already computed\n  if (n in memo) return memo[n];\n  \n  // Base cases\n  if (n <= 1) return n;\n  \n  // Store result before returning\n  memo[n] = fibMemo(n-1, memo) + fibMemo(n-2, memo);\n  return memo[n];\n}",
    explanation:
      "This recursive Fibonacci function uses memoization to store and reuse previously calculated values, dramatically improving performance.",
    category: "Algorithms",
    isExampleVisible: false
  }
])

// Filtered glossary items based on search and category
const filteredGlossaryItems = computed(() => {
  return glossaryItems.value.filter(item => {
    const matchesSearch =
      searchTerm.value === "" ||
      item.term.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesCategory = activeCategory.value === "All" || item.category === activeCategory.value
    return matchesSearch && matchesCategory
  })
})

// Toggle example visibility
const toggleExample = index => {
  const actualIndex = glossaryItems.value.findIndex(item => item.term === filteredGlossaryItems.value[index].term)
  if (actualIndex !== -1) {
    glossaryItems.value[actualIndex].isExampleVisible = !glossaryItems.value[actualIndex].isExampleVisible
  }
}

// Set active category
const setActiveCategory = category => {
  activeCategory.value = category
}

const toggleView = mode => {
  viewMode.value = mode
}

const copyToClipboard = text => {
  navigator.clipboard.writeText(text).then(() => {
    showCopyNotification.value = true
    setTimeout(() => {
      showCopyNotification.value = false
    }, 2000)
  })
}

// Close when search or category changes
watch([searchTerm, activeCategory], () => {
  glossaryItems.value.forEach(item => {
    item.isExampleVisible = false
  })
})
</script>

<style scoped>
/* Complex styles that are better kept in CSS */

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  font-size: 1rem;
}

.view-btn {
  background-color: white;
  border: 1px solid #e2e8f0;
  color: #64748b;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.dark .view-btn {
  background-color: #1e293b;
  border: 1px solid #334155;
  color: #94a3b8;
}

.view-btn:first-child {
  border-radius: 6px 0 0 6px;
}

.view-btn:last-child {
  border-radius: 0 6px 6px 0;
}

.view-btn:hover {
  background-color: #f8fafc;
}

.dark .view-btn:hover {
  background-color: #273549;
}

.view-btn.active {
  background-color: #0f766e;
  border-color: #0f766e;
  color: white;
}

.toggle-btn {
  background-color: transparent;
  border: none;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  min-width: 32px;
}

.dark .toggle-btn {
  color: #94a3b8;
}

.toggle-btn:hover {
  color: #0f172a;
  background-color: #f1f5f9;
}

.dark .toggle-btn:hover {
  color: #f8fafc;
  background-color: #334155;
}

.toggle-btn.active {
  color: #10b981;
}

.toggle-arrow {
  font-size: 1rem;
}

.copy-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 2px 4px;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.dark .copy-btn {
  color: #94a3b8;
}

.copy-btn:hover {
  color: #0f172a;
}

.dark .copy-btn:hover {
  color: #f8fafc;
}

pre.code-pre {
  margin: 0;
  padding: 12px;
  font-family: "Courier New", Courier, monospace;
  overflow-x: auto;
  font-size: 0.85rem;
  line-height: 1.5;
  white-space: pre-wrap;
}

.copy-notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #0f766e;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  animation:
    fadeIn 0.3s,
    fadeOut 0.3s 1.7s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(10px);
  }
}

/* Responsive styles */
@media (max-width: 768px) {
  .glossary-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .term-column {
    width: 100%;
    padding: 0 0 8px 0;
  }

  .definition {
    width: 100%;
    padding: 8px 0;
  }

  .example-toggle {
    width: 100%;
    text-align: left;
    padding: 8px 0 0 0;
  }
}
</style>
