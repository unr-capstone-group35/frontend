<template>
  <div>
    <!-- Start Learning Card -->
    <section class="h-[calc(100vh-35px)] flex items-start bg-gradient-to-b from-white dark:from-gray-900 to-green-50 dark:to-gray-800">
      <div class="container mx-auto px-4 pt-20">
        <div class="text-center mb-12">
          <span class="font-bold text-6xl animate-gradient bg-gradient-text">DevQuest</span>
        </div>
        <!-- First card content-->
        <div class="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-6xl mx-auto mt-32">
          <div class="lg:w-1/2 text-center lg:text-left order-2 lg:order-1">
            <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              The free, fun, and effective way to learn programming concepts!
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Master programming fundamentals through interactive lessons and hands-on coding challenges.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto lg:mx-0">
              <NuxtLink
                to="/start-learning"
                class="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-bold py-4 px-8 rounded-xl shadow-md transition-colors flex-1"
              >
                START LEARNING
              </NuxtLink>
              <NuxtLink
                to="/signin"
                class="inline-flex items-center justify-center border-2 border-emerald-600 dark:border-emerald-500 text-emerald-600 dark:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 font-bold py-4 px-8 rounded-xl transition-colors flex-1"
              >
                SIGN IN
              </NuxtLink>
            </div>
          </div>
          <div class="lg:w-1/2 order-1 lg:order-2">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-br from-green-200 dark:from-green-800 to-green-100 dark:to-green-900 rounded-2xl transform -rotate-3"></div>
              <div class="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                <div class="space-y-4">
                  <div class="flex items-center gap-4">
                    <div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <span class="text-3xl">💻</span>
                    </div>
                    <div class="flex-1">
                      <h3 class="font-semibold text-lg text-gray-900 dark:text-white">Start Coding Today</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-300">Interactive lessons & challenges</p>
                    </div>
                  </div>

                    <div class="space-y-3 font-mono text-sm">

                      <div class="p-2">
                        <span class="text-emerald-600 dark:text-emerald-400">function </span> 
                        <span class="text-purple-600 dark:text-purple-400">learnToCode</span>
                        <span class="text-gray-900 dark:text-gray-300">()</span>
                        <span class="text-gray-900 dark:text-gray-300">{</span>
                      </div>

                      <div class="p-2 pl-6 whitespace-nowrap overflow-x-auto">
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
                        <span class="text-blue-600 dark:text-blue-400">return</span>
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
    <section class="h-screen flex items-center bg-gradient-to-b from-indigo-50 dark:from-indigo-950 to-purple-50 dark:to-purple-950">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-6xl mx-auto">
          <div class="lg:w-1/2 text-center lg:text-left order-2 lg:order-2">
            <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              What You'll Learn
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Dive deep into computer science fundamentals including algorithms, data structures, and programming patterns.
            </p>
            <div class="space-y-4">
              <div v-for="(feature, index) in learningFeatures" :key="index" class="flex items-center gap-3">
                <div class="w-6 h-6 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                  <div class="w-3 h-3 bg-indigo-500 rounded-full"></div>
                </div>
                <span class="text-gray-700 dark:text-gray-300">{{ feature }}</span>
              </div>
            </div>
          </div>
          <div class="lg:w-1/2 order-1 lg:order-1">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-br from-indigo-200 dark:from-indigo-800 to-purple-100 dark:to-purple-900 rounded-2xl transform -rotate-3"></div>
              <div class="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                <!-- Book graphic -->
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
                  <path d="M50 60 L350 60 C360 60 370 70 370 80 L370 240 C370 250 360 260 350 260 L50 260 C40 260 30 250 30 240 L30 80 C30 70 40 60 50 60" 
                        fill="#818CF8" 
                        opacity="0.9"/>
                  
                  <path d="M50 70 L350 70 C355 70 360 75 360 80 L360 240 C360 245 355 250 350 250 L50 250 C45 250 40 245 40 240 L40 80 C40 75 45 70 50 70" 
                        fill="white"/>
                  
                  <g stroke="#E0E7FF" stroke-width="2">
                    <line x1="70" y1="100" x2="330" y2="100"/>
                    <line x1="70" y1="130" x2="330" y2="130"/>
                    <line x1="70" y1="160" x2="330" y2="160"/>
                    <line x1="70" y1="190" x2="330" y2="190"/>
                    <line x1="70" y1="220" x2="330" y2="220"/>
                  </g>
                  
                  <path d="M300 60 L300 40 L330 40 L315 60" 
                        fill="#6366F1"/>
                  
                  <path d="M50 60 C40 60 30 70 30 80 L30 240 C30 250 40 260 50 260" 
                        fill="#6366F1" 
                        opacity="0.3"/>
                  
                  <circle cx="200" cy="40" r="8" fill="#818CF8" opacity="0.5"/>
                  <circle cx="180" cy="30" r="5" fill="#818CF8" opacity="0.3"/>
                  <circle cx="220" cy="35" r="4" fill="#818CF8" opacity="0.4"/>
                </svg>
                <!-- End of book graphic -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Game Mechanics Card -->
    <section class="h-screen flex items-center bg-gradient-to-b from-white dark:from-gray-900 to-green-50 dark:to-gray-800">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-6xl mx-auto">
          <div class="lg:w-1/2 text-center lg:text-left order-2 lg:order-1">
            <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Game Mechanics
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Learn while having fun with game-like features that keep you motivated.
            </p>
            <div class="space-y-4">
              <div v-for="(feature, index) in gameFeatures" :key="index" class="flex items-center gap-3">
                <div class="w-6 h-6 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                  <div class="w-3 h-3 bg-emerald-500 rounded-full"></div>
                </div>
                <span class="text-gray-700 dark:text-gray-300">{{ feature }}</span>
              </div>
            </div>
          </div>
          <div class="lg:w-1/2 order-1 lg:order-2">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-br from-green-200 dark:from-green-800 to-green-100 dark:to-green-900 rounded-2xl transform -rotate-3"></div>
              <div class="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                <!-- Controller graphic -->
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
                  <path d="M120 160 C100 140 100 100 150 100 L250 100 C300 100 300 140 280 160 Q260 180 200 180 Q140 180 120 160 Z" 
                        fill="#22c55e" 
                        opacity="0.9"/>

                  <rect x="140" y="120" width="10" height="30" fill="white"/>
                  <rect x="130" y="130" width="30" height="10" fill="white"/>

                  <circle cx="260" cy="120" r="8" fill="white"/> <!-- Right Buttons: Top -->
                  <circle cx="275" cy="135" r="8" fill="white"/> <!-- Right Buttons: Right  -->
                  <circle cx="245" cy="135" r="8" fill="white"/> <!-- Right Buttons: Left  -->
                  <circle cx="260" cy="150" r="8" fill="white"/> <!-- Right Buttons: Bottom  -->

                  <circle cx="170" cy="160" r="12" fill="#166534"/>
                  <circle cx="230" cy="160" r="12" fill="#166534"/>
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

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      learningFeatures: [
        'Basic to advanced programming concepts',
        'Problem-solving techniques',
        'Data structures & algorithms',
        'Software design principles'
      ],
      gameFeatures: [
        'Daily streaks & achievements',
        'Points system for completed lessons',
        'Compete with friends on leaderboards',
        'Unlock new challenges as you progress'
      ]
    }
  }
}
</script>

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
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

/* DevQuest animation */
.bg-gradient-text {
  background: linear-gradient(to right, #059669, #34d399, #059669);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  background-size: 200% 100%;
  animation: gradient 6s linear infinite;
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