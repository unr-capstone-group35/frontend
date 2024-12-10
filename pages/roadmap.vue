<!-- pages/roadmap.vue-->
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
        <div 
          v-if="getMainContent()" 
          class="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-md"
        >
          <h2 class="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
            {{ selectedTopic.name }} Roadmap
          </h2>
          <p class="text-gray-600 dark:text-gray-300 mb-2 text-lg">
            {{ selectedTopic.description }}
          </p>

          <div class="border-b-2 border-gray-300 dark:border-gray-600 mb-4"></div>

          <!-- Scrollable Roadmap Section -->
          <div class="max-h-[calc(100vh-200px)] overflow-y-auto">
            <div 
              v-for="(step, index) in roadmapSteps" 
              :key="index"
            >
              <div
                @click="navigateToLesson(step)"
                class="block mb-4 transition duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-4 cursor-pointer"
              >
                <div class="flex items-center">
                  <!-- Numbered Circle -->
                  <div
                    class="w-12 h-12 flex justify-center items-center bg-emerald-600 dark:bg-emerald-500 text-white rounded-full mr-4"
                  >
                    {{ index + 1 }}
                  </div>
                  
                  <div class="flex flex-col">
                    <h3 class="text-xl font-semibold text-gray-800 dark:text-white">
                      {{ step.title }}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-300 text-lg">
                      {{ step.description }}
                    </p>
                  </div>
                </div>
              </div>
              <div
                v-if="index !== roadmapSteps.length - 1"
                class="border-b border-gray-200 dark:border-gray-600 mb-4"
              ></div>
            </div>
          </div>
        </div>
        <div 
          v-if="getEmptyState()" 
          class="text-center text-gray-500 dark:text-gray-400 text-xl"
        >
          Select a topic to view the roadmap.
        </div>
      </main>
    </div>
  </div>
</template>


<script>
import { useCourseStore } from '~/stores/courseStore'
import { useRouter } from 'vue-router'

export default {
  name: "RoadmapPage",
  
  setup() {
    const courseStore = useCourseStore()
    const router = useRouter()
    
    return {
      courseStore,
      router
    }
  },

  data() {
    return {

      topics: [
        {
          id: 'cs-basics',
          name: "Computer Science Basics",
          description: "Master the fundamental concepts of computer science and programming"
        },
        {
          id: 'data-structures',
          name: "Data Structures",
          description: "Dive deep into essential data structures that power modern software"
        },
        {
          id: 'algorithms',
          name: "Algorithms",
          description: "Master complex algorithms and optimization techniques used in modern software development"
        }
      ],

      selectedTopic: null,
      stats: [
        {
          id: 1,
          name: "Top Learner",
          value: "User123"
        },
        {
          id: 2,
          name: "Completed Topics",
          value: "15"
        },
        {
          id: 3,
          name: "Total Points",
          value: "3450"
        }
      ],
      roadmapSteps: [],
    }
  },

  mounted() {
    const currentCourseStore = this.courseStore;
    
    if (currentCourseStore.selectedCourse) {
      const selectedCourseId = currentCourseStore.selectedCourse.id;
      const matchingTopic = this.topics.find(function(topic) {
        return topic.id === selectedCourseId;
      });

      if (matchingTopic) {
        this.selectTopic(matchingTopic);
      }
    }
  },

  methods: {
    getTopicClasses(topicId) {
      let baseClasses = "p-4 cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition";
      
      if (this.selectedTopic) {
        const isSelected = this.selectedTopic.id === topicId;
        
        if (isSelected) {
          baseClasses = baseClasses + " bg-emerald-200 dark:bg-emerald-800";
        }
      }
      
      return baseClasses;
    },

    getMainContent() {
      let hasSelectedTopic;
      if (this.selectedTopic !== null) {
          hasSelectedTopic = true;
      } else {
          hasSelectedTopic = false;
      }
      return hasSelectedTopic;
    },

    getEmptyState() {
      let hasSelectedTopic;
      if (this.selectedTopic !== null) {
          hasSelectedTopic = true;
      } else {
          hasSelectedTopic = false;
      }
      return !hasSelectedTopic;
    },

    selectTopic(topic) {
      this.selectedTopic = topic;
      
      const topicId = topic.id;
      const availableCourses = this.courseStore.courses;
      
      if (availableCourses[topicId]) {
        const courseSteps = availableCourses[topicId].steps;
        this.roadmapSteps = courseSteps;
      } else {
        this.roadmapSteps = [];
      }
    },

    navigateToLesson(step) {
      const navigationConfig = {
        path: '/learn',
        query: {
          course: this.selectedTopic.id,
          lesson: step.lessonId,
          exercise: step.exerciseId
        }
      };

      this.router.push(navigationConfig);
    }
  },
}
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