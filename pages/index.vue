<script setup lang="ts">
const authStore = useAuthStore();

// Initialize auth state from cookies when the component mounts
onMounted(() => {
  authStore.initializeFromCookie();
});

useHead({
  title: "DevQuest",
});

// Move the data properties to refs
const learningFeatures = ref([
  "Basic to advanced programming concepts",
  "Problem-solving techniques",
  "Data structures & algorithms",
  "Software design principles",
]);

const gameFeatures = ref([
  "Daily streaks & achievements",
  "Points system for completed lessons",
  "Compete with friends on leaderboards",
  "Unlock new challenges as you progress",
]);
</script>

<template>
  <div>
    <!-- Start Learning Card -->
    <section class="page-container flex items-start">
      <div class="container mx-auto px-4 pt-20">
        <div class="mb-12 text-center">
          <span class="animate-gradient bg-gradient-text text-6xl font-bold">DevQuest</span>
        </div>
        <!-- First card content-->
        <div class="mx-auto mt-32 flex max-w-6xl flex-col items-center justify-between gap-12 lg:flex-row">
          <div class="order-2 text-center lg:order-1 lg:w-1/2 lg:text-left">
            <h1 class="mb-6 text-4xl font-bold text-gray-900 dark:text-white lg:text-5xl">
              The free, fun, and effective way to learn programming concepts!
            </h1>
            <p class="mb-8 text-lg text-gray-600 dark:text-gray-300">
              Learn programming concepts through interactive exercises and reference materials in a gamified,
              competitive way.
            </p>
            <div class="mx-auto flex max-w-md flex-col gap-4 sm:flex-row lg:mx-0">
              <NuxtLink
                to="/start-learning"
                class="bg-primary hover-primary flex flex-1 items-center justify-center rounded-xl px-8 py-4 text-center font-bold text-white shadow-md transition-colors"
              >
                START LEARNING
              </NuxtLink>
              <NuxtLink
                :to="authStore.isAuthenticated ? '/dashboard' : '/signin'"
                class="inline-flex flex-1 items-center justify-center rounded-xl border-2 border-emerald-600 px-8 py-4 font-bold text-emerald-600 transition-colors hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-500 dark:hover:bg-emerald-900/50"
              >
                {{ authStore.isAuthenticated ? "DASHBOARD" : "SIGN IN" }}
              </NuxtLink>
            </div>
          </div>
          <div class="order-1 lg:order-2 lg:w-1/2">
            <div class="relative">
              <div class="background-card"></div>
              <div class="card relative p-8">
                <div class="space-y-4">
                  <div class="flex items-center gap-4">
                    <div
                      class="flex h-16 w-16 items-center justify-center rounded-lg bg-emerald-400 dark:bg-emerald-800"
                    >
                      <span class="text-3xl">💻</span>
                    </div>
                    <div class="flex-1">
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Start Learning Today</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-300">Interactive lessons & challenges</p>
                    </div>
                  </div>

                  <div class="space-y-3 font-mono text-sm">
                    <div class="p-2">
                      <span class="text-primary">function </span>
                      <span class="text-purple-600 dark:text-purple-400">learnToCode</span>
                      <span class="text-gray-900 dark:text-gray-300">()</span>
                      <span class="text-gray-900 dark:text-gray-300">{</span>
                    </div>

                    <div class="overflow-x-auto whitespace-nowrap p-2 pl-6">
                      <span class="text-blue-600 dark:text-blue-400">const </span>
                      <span class="text-gray-900 dark:text-gray-300">skills </span>
                      <span class="text-gray-900 dark:text-gray-300">= </span>
                      <span class="text-gray-900 dark:text-gray-300">[</span>
                      <span class="text-orange-600 dark:text-orange-400">'Basics'</span>
                      <span class="text-gray-900 dark:text-gray-300">,</span>
                      <span class="text-orange-600 dark:text-orange-400">'Data-Structs'</span>
                      <span class="text-gray-900 dark:text-gray-300">,</span>
                      <span class="text-orange-600 dark:text-orange-400">'Algorithms'</span>
                      <span class="text-gray-900 dark:text-gray-300">]</span>
                      <span class="text-gray-900 dark:text-gray-300">;</span>
                    </div>

                    <div class="p-2 pl-6">
                      <span class="text-blue-600 dark:text-blue-400">return </span>
                      <span class="text-orange-600 dark:text-orange-400">'Success!'</span>
                      <span class="text-gray-900 dark:text-gray-300">;</span>
                    </div>

                    <div class="p-2">
                      <span class="text-gray-900 dark:text-gray-300">}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- What You'll Learn Card -->
    <section
      class="flex h-screen items-center bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950"
    >
      <div class="container mx-auto px-4">
        <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-20 lg:flex-row">
          <div class="order-2 text-center lg:order-2 lg:w-1/2 lg:text-left">
            <h2 class="mb-6 text-4xl font-bold text-gray-900 dark:text-white lg:text-5xl">What You'll Learn</h2>
            <p class="mb-8 text-lg text-gray-600 dark:text-gray-300">
              Dive deep into computer science fundamentals including algorithms, data structures, and programming
              patterns.
            </p>
            <div class="space-y-4">
              <div v-for="(feature, index) in learningFeatures" :key="index" class="flex items-center gap-3">
                <div class="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                  <div class="h-3 w-3 rounded-full bg-indigo-500"></div>
                </div>
                <span class="text-gray-700 dark:text-gray-300">{{ feature }}</span>
              </div>
            </div>
          </div>
          <div class="order-1 lg:order-1 lg:w-1/2">
            <div class="relative">
              <div class="background-card"></div>
              <div class="card relative p-8">
                <!-- Book graphic -->
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
                  <path
                    d="M50 60 L350 60 C360 60 370 70 370 80 L370 240 C370 250 360 260 350 260 L50 260 C40 260 30 250 30 240 L30 80 C30 70 40 60 50 60"
                    fill="#818CF8"
                    opacity="0.9"
                  />

                  <path
                    d="M50 70 L350 70 C355 70 360 75 360 80 L360 240 C360 245 355 250 350 250 L50 250 C45 250 40 245 40 240 L40 80 C40 75 45 70 50 70"
                    fill="white"
                  />

                  <g stroke="#E0E7FF" stroke-width="2">
                    <line x1="70" y1="100" x2="330" y2="100" />
                    <line x1="70" y1="130" x2="330" y2="130" />
                    <line x1="70" y1="160" x2="330" y2="160" />
                    <line x1="70" y1="190" x2="330" y2="190" />
                    <line x1="70" y1="220" x2="330" y2="220" />
                  </g>

                  <path d="M300 60 L300 40 L330 40 L315 60" fill="#6366F1" />

                  <path d="M50 60 C40 60 30 70 30 80 L30 240 C30 250 40 260 50 260" fill="#6366F1" opacity="0.3" />

                  <circle cx="200" cy="40" r="8" fill="#818CF8" opacity="0.5" />
                  <circle cx="180" cy="30" r="5" fill="#818CF8" opacity="0.3" />
                  <circle cx="220" cy="35" r="4" fill="#818CF8" opacity="0.4" />
                </svg>
                <!-- End of book graphic -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Game Mechanics Card -->
    <section class="bg-page-gradient flex h-screen items-center">
      <div class="container mx-auto px-4">
        <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-12 lg:flex-row">
          <div class="order-2 text-center lg:order-1 lg:w-1/2 lg:text-left">
            <h2 class="mb-6 text-4xl font-bold text-gray-900 dark:text-white lg:text-5xl">Game Mechanics</h2>
            <p class="mb-8 text-lg text-gray-600 dark:text-gray-300">
              Learn while having fun with game-like features that keep you motivated.
            </p>
            <div class="space-y-4">
              <div v-for="(feature, index) in gameFeatures" :key="index" class="flex items-center gap-3">
                <div class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
                  <div class="h-3 w-3 rounded-full bg-emerald-500"></div>
                </div>
                <span class="text-gray-700 dark:text-gray-300">{{ feature }}</span>
              </div>
            </div>
          </div>
          <div class="order-1 lg:order-2 lg:w-1/2">
            <div class="relative">
              <div class="background-card"></div>
              <div class="card relative p-8">
                <!-- Controller graphic -->
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
                  <path
                    d="M120 160 C100 140 100 100 150 100 L250 100 C300 100 300 140 280 160 Q260 180 200 180 Q140 180 120 160 Z"
                    fill="#22c55e"
                    opacity="0.9"
                  />

                  <rect x="140" y="120" width="10" height="30" fill="white" />
                  <rect x="130" y="130" width="30" height="10" fill="white" />

                  <circle cx="260" cy="120" r="8" fill="white" />
                  <!-- Right Buttons: Top -->
                  <circle cx="275" cy="135" r="8" fill="white" />
                  <!-- Right Buttons: Right  -->
                  <circle cx="245" cy="135" r="8" fill="white" />
                  <!-- Right Buttons: Left  -->
                  <circle cx="260" cy="150" r="8" fill="white" />
                  <!-- Right Buttons: Bottom  -->

                  <circle cx="170" cy="160" r="12" fill="#166534" />
                  <circle cx="230" cy="160" r="12" fill="#166534" />
                </svg>
                <!-- End of Controller graphic -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Scrolling behavior */
:deep(html) {
  scroll-behavior: smooth;
  scroll-snap-type: y mandatory;
}

:deep(section) {
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

/* Scrollbar hiding */
:deep(::-webkit-scrollbar) {
  display: none;
}

:deep(*) {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

/* DevQuest animation */
.bg-gradient-text {
  background: linear-gradient(to right, #059669, #34d399, #059669);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  background-size: 200% 100%;
  animation: gradient 4s linear infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}
</style>
