<template>
  <div class="min-h-screen flex bg-gray-100">
    <!-- Sidebar for Topics -->
<aside class="w-1/4 bg-white shadow-md p-6">
  <h2 class="text-2xl font-bold mb-6">Topics</h2>
  <ul class="divide-y-2 divide-gray-400">
    <li
      v-for="topic in topics"
      :key="topic.id"
      @click="selectTopic(topic)"
      class="p-4 cursor-pointer hover:bg-emerald-100 transition"
      :class="{
        'bg-emerald-200': selectedTopic && selectedTopic.id === topic.id
      }"
    >
      <h3 class="text-xl font-semibold text-gray-700">{{ topic.name }}</h3>
      <p class="text-gray-600">{{ topic.description }}</p>
    </li>
  </ul>
</aside>
    <!-- Main Content for Roadmap -->
    <main class="flex-1 p-8">
      <div v-if="selectedTopic" class="bg-white p-10 rounded-lg shadow-md">
        <h2 class="text-3xl font-semibold text-gray-800 mb-4">
          {{ selectedTopic.name }} Roadmap
        </h2>
        <p class="text-gray-600 mb-6 text-lg">
          {{ selectedTopic.description }}
        </p>

        <!-- Scrollable Roadmap Section -->
        <div class="max-h-[500px] overflow-y-auto">
          <div v-for="(step, index) in roadmapSteps" :key="index" class="mb-6">
            <div class="flex items-center mb-4">
              <div
                class="w-12 h-12 flex justify-center items-center bg-emerald-600 text-white rounded-full mr-4"
              >
                {{ index + 1 }}
              </div>
              <div class="flex-1 border-t-2 border-emerald-600"></div>
            </div>
            <div class="ml-16">
              <h3 class="text-xl font-semibold text-gray-800">{{ step.title }}</h3>
              <p class="text-gray-600 text-lg">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center text-gray-500 text-xl">
        Select a topic to view the roadmap.
      </div>
    </main>

    <!-- Right Sidebar for Stats/Leaderboard -->
    <aside class="w-1/4 bg-white shadow-md p-6">
      <h2 class="text-2xl font-bold mb-6">Stats</h2>
      <ul class="space-y-4">
        <li
          v-for="stat in stats"
          :key="stat.id"
          class="p-4 rounded-lg bg-gray-100"
        >
          <h3 class="text-xl font-semibold text-gray-700">{{ stat.name }}</h3>
          <p class="text-gray-800 text-lg font-bold">{{ stat.value }}</p>
        </li>
      </ul>
    </aside>
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