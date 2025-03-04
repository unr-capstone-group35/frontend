<template>
  <div class="relative mx-auto max-w-[900px] p-6 font-sans">
    <h1 class="mb-6 text-center text-4xl font-bold text-emerald-500">📚 Programming Glossary</h1>

    <div class="mb-4 flex items-center justify-between">
      <div class="relative max-w-[700px] flex-grow">
        <div class="search-icon">🔍</div>
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Search terms..."
          class="w-full rounded-lg border border-slate-700 bg-slate-800 px-9 py-2.5 text-base text-slate-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
        <button
          v-if="searchTerm"
          @click="searchTerm = ''"
          class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer border-none bg-transparent p-0 text-base text-slate-400 hover:text-slate-50"
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
          'cursor-pointer whitespace-nowrap rounded-md border px-4 py-2 text-slate-50 transition-all duration-200 hover:bg-slate-700',
          activeCategory === 'All' ? 'border-teal-800 bg-teal-800 text-white' : 'border-slate-700 bg-slate-800'
        ]"
      >
        All
      </button>

      <button
        @click="setActiveCategory('Basics')"
        :class="[
          'cursor-pointer whitespace-nowrap rounded-md border px-4 py-2 text-slate-50 transition-all duration-200 hover:bg-slate-700',
          activeCategory === 'Basics' ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-700 bg-slate-800'
        ]"
      >
        Basics
      </button>

      <button
        @click="setActiveCategory('Data Structures')"
        :class="[
          'cursor-pointer whitespace-nowrap rounded-md border px-4 py-2 text-slate-50 transition-all duration-200 hover:bg-slate-700',
          activeCategory === 'Data Structures'
            ? 'border-blue-700 bg-blue-700 text-white'
            : 'border-slate-700 bg-slate-800'
        ]"
      >
        Data Structures
      </button>

      <button
        @click="setActiveCategory('Algorithms')"
        :class="[
          'cursor-pointer whitespace-nowrap rounded-md border px-4 py-2 text-slate-50 transition-all duration-200 hover:bg-slate-700',
          activeCategory === 'Algorithms' ? 'border-red-700 bg-red-700 text-white' : 'border-slate-700 bg-slate-800'
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
        class="mb-4 overflow-hidden rounded-lg border border-slate-700 bg-slate-800 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
      >
        <div class="flex items-center border-b border-slate-700 p-4">
          <div class="w-[120px] min-w-[120px] pr-4">
            <div class="pl-0.5 font-semibold text-slate-50">{{ item.term }}</div>
          </div>
          <div class="flex-grow px-2 pr-6 text-slate-300">{{ item.definition }}</div>
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
        <div v-if="item.isExampleVisible" class="border-t border-slate-700 bg-slate-700 p-4">
          <div class="mb-4 overflow-hidden rounded bg-slate-900 text-slate-200">
            <div class="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-3 py-2">
              <span>Example</span>
              <button @click="copyToClipboard(item.example)" class="copy-btn" title="Copy to clipboard">📋</button>
            </div>
            <pre><code>{{ item.example }}</code></pre>
          </div>
          <div v-if="item.explanation" class="mb-4 rounded bg-slate-800 p-3">
            <h4 class="mb-2 mt-0 text-sm text-slate-50">Explanation:</h4>
            <p class="m-0 text-sm leading-6 text-slate-300">{{ item.explanation }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Card view mode -->
    <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="(item, index) in filteredGlossaryItems"
        :key="index"
        class="flex h-full flex-col overflow-hidden rounded-lg border border-slate-700 bg-slate-800 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
      >
        <div class="flex items-center justify-between border-b border-slate-700 p-4">
          <h3 class="m-0 text-lg text-slate-50">{{ item.term }}</h3>
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
          <p class="mb-4 mt-0 flex-grow text-slate-300">{{ item.definition }}</p>
          <div class="mb-4 flex items-center">
            <button @click="toggleExample(index)" class="toggle-btn" :class="{ active: item.isExampleVisible }">
              {{ item.isExampleVisible ? "Hide" : "Show" }}
            </button>
          </div>
          <div v-if="item.isExampleVisible" class="mt-4 border-t border-slate-600 pt-4">
            <div class="mb-4 overflow-hidden rounded bg-slate-900 text-slate-200">
              <div class="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-3 py-2">
                <span>Example</span>
                <button @click="copyToClipboard(item.example)" class="copy-btn" title="Copy to clipboard">📋</button>
              </div>
              <pre><code>{{ item.example }}</code></pre>
            </div>
            <div v-if="item.explanation" class="mb-4 rounded bg-slate-800 p-3">
              <h4 class="mb-2 mt-0 text-sm text-slate-50">Explanation:</h4>
              <p class="m-0 text-sm leading-6 text-slate-300">{{ item.explanation }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state when no results -->
    <div v-if="filteredGlossaryItems.length === 0" class="py-10 text-center text-slate-400">
      <p>No matching terms found. Try adjusting your search.</p>
    </div>

    <!-- Resullt stats -->
    <div class="mt-6 text-center text-sm text-slate-500">
      <p>Showing {{ filteredGlossaryItems.length }} of {{ glossaryItems.length }} terms</p>
    </div>

    <div v-if="showCopyNotification" class="copy-notification">Copied to clipboard!</div>
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
    example: "function add(a, b) { return a + b; }",
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
    example: 'person = { name: "John", age: 30 }',
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
  background-color: #1e293b;
  border: 1px solid #334155;
  color: #94a3b8;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.view-btn:first-child {
  border-radius: 6px 0 0 6px;
}

.view-btn:last-child {
  border-radius: 0 6px 6px 0;
}

.view-btn:hover {
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
  color: #94a3b8;
  min-width: 32px;
}

.toggle-btn:hover {
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
  color: #94a3b8;
  cursor: pointer;
  padding: 2px 4px;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.copy-btn:hover {
  color: #f8fafc;
}

pre {
  margin: 0;
  padding: 12px;
  font-family: "Courier New", Courier, monospace;
  overflow-x: auto;
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
