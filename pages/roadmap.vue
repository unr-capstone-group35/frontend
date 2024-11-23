<template>
  <div class="min-h-screen flex flex-col">
    <div class="flex-1 flex bg-gray-100 dark:bg-gray-900">
      <!-- Sidebar for Topics -->
      <aside class="w-1/4 bg-white dark:bg-gray-800 shadow-md p-6 overflow-y-auto">
        <h2 class="text-2xl font-bold mb-6 dark:text-white">Topics</h2>
        <ul class="divide-y-2 divide-gray-400 dark:divide-gray-600">
          <li
            v-for="topic in topics"
            :key="topic.id"
            @click="selectTopic(topic)"
            :class="getTopicClasses(topic.id)"
          >
            <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-200">{{ topic.name }}</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ topic.description }}</p>
          </li>
        </ul>
      </aside>

      <!-- Main Content for Roadmap -->
      <main class="flex-1 p-8 overflow-y-auto">
        <div v-if="getMainContent()" class="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-md">
          <h2 class="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
            {{ selectedTopic.name }} Roadmap
          </h2>
          <p class="text-gray-600 dark:text-gray-300 mb-2 text-lg">
            {{ selectedTopic.description }}
          </p>

          <div class="border-b-2 border-gray-300 dark:border-gray-600 mb-4"></div>

          <!-- Scrollable Roadmap Section -->
          <div class="max-h-[calc(100vh-200px)] overflow-y-auto">
            <div v-for="(step, index) in roadmapSteps" :key="index">
              <router-link 
                :to="`/lessons/${step.id}`" 
                class="block mb-4 transition duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-4"
              >
                <div class="flex items-center">
                  <!-- Numbered Circle -->
                  <div
                    class="w-12 h-12 flex justify-center items-center bg-emerald-600 dark:bg-emerald-500 text-white rounded-full mr-4"
                  >
                    {{ index + 1 }}
                  </div>
                  
                  <div class="flex flex-col">
                    <h3 class="text-xl font-semibold text-gray-800 dark:text-white">{{ step.title }}</h3>
                    <p class="text-gray-600 dark:text-gray-300 text-lg">{{ step.description }}</p>
                  </div>
                </div>
              </router-link>
              <div 
                v-if="index !== roadmapSteps.length - 1" 
                class="border-b border-gray-200 dark:border-gray-600 mb-4"
              ></div>
            </div>
          </div>
        </div>
        <div v-if="getEmptyState()" class="text-center text-gray-500 dark:text-gray-400 text-xl">
          Select a topic to view the roadmap.
        </div>
      </main>

      <!-- SideBar for stats -->
      <aside class="w-64 bg-white dark:bg-gray-800 shadow-md text-white p-4 flex flex-col overflow-y-auto">
        <!-- Profile Section -->
        <div class="flex flex-col items-center space-y-4 mb-8">
          <div class="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
            <svg 
              class="w-16 h-16 text-gray-400" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fill-rule="evenodd" 
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" 
                clip-rule="evenodd" 
              />
            </svg>
          </div>
          
          <h2 class="text-xl font-semibold  text-gray-800 dark:text-gray-300">User</h2>
        </div>

        <!-- Stats Section -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 flex flex-col items-center">
            <div class="text-sm text-gray-800 dark:text-gray-300">Streak</div>
            <div class="text-xl font-bold text-black dark:text-white">0</div>
          </div>

          <div class="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 flex flex-col items-center">
            <div class="text-sm text-gray-800 dark:text-gray-300">Exercises</div>
            <div class="text-xl font-bold text-black dark:text-white">0</div>
          </div>
        </div>

        <div class="mb-6">
          <div class="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 flex flex-col items-center">
            <div class="text-sm text-gray-800 dark:text-gray-300">Points</div>
            <div class="text-xl font-bold text-black dark:text-white">0</div>
          </div>
        </div>

        <!-- Buttons Section -->
        <div class="mt-auto space-y-3">
          <NuxtLink 
            to="/leaderboard" 
            class="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-150 ease-in-out text-center">
            Leaderboard
          </NuxtLink>
          
          <button class="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition duration-150 ease-in-out">
            Sign Out
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>


<script>
  import { useCourseStore } from '~/stores/courseStore'

  export default {
    name: "RoadmapPage",
    setup() {
      const courseStore = useCourseStore()
      return {
        courseStore
      }
    },
    data() {
      return {
        topics: [
          { id: 'cs-basics', name: "Computer Science Basics", description: "Master the fundamental concepts of computer science and programming" },
          { id: 'data-structures', name: "Data Structures", description: "Dive deep into essential data structures that power modern software" },
          { id: 'algorithms', name: "Algorithms", description: "Master complex algorithms and optimization techniques used in modern software development" },
        ],
        selectedTopic: null,
        stats: [
          { id: 1, name: "Top Learner", value: "User123" },
          { id: 2, name: "Completed Topics", value: "15" },
          { id: 3, name: "Total Points", value: "3450" },
        ],
        roadmapSteps: [],
      };
    },
    mounted() {
      if (this.courseStore.selectedCourse) {
        const topic = this.topics.find(t => t.id === this.courseStore.selectedCourse.id)
        if (topic) {
          this.selectTopic(topic)
        }
      }
    },
    methods: {
      getTopicClasses(topicId) {
        let classes = "p-4 cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition"
        
        if (this.selectedTopic) {
          if (this.selectedTopic.id === topicId) {
            classes += " bg-emerald-200 dark:bg-emerald-800"
          }
        }
        
        return classes
      },
      getMainContent() {
        if (this.selectedTopic) {
          return true
        }
        return false
      },
      getEmptyState() {
        if (this.selectedTopic) {
          return false
        }
        return true
      },
      selectTopic(topic) {
        this.selectedTopic = topic;
        if (this.courseStore.courses[topic.id]) {
          this.roadmapSteps = this.courseStore.courses[topic.id].steps;
        } else {
          this.roadmapSteps = [];
        }
      },
    },
  };
</script>

<style scoped>
.min-h-screen {
  display: flex;
}
aside {
  max-width: 100%;
  overflow-y: auto;
}
</style>


