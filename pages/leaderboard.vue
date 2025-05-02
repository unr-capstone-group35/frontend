<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useAuthStore } from "~/stores/authStore";
import { useProfilePicStore } from "~/stores/profilePicStore";
import { usePointsStore } from "~/stores/pointsStore";

// Add middleware to ensure auth
definePageMeta({
  middleware: ["auth"],
});

useHead({
  title: "Leaderboard | DevQuest",
});

const profilePicUpdateTrigger = ref(Date.now());
const authStore = useAuthStore();
const profilePicStore = useProfilePicStore();
const pointsStore = usePointsStore();

// Load data on mount
onMounted(async () => {
  if (authStore.isAuthenticated) {
    await Promise.all([refreshProfilePic(), pointsStore.fetchPointsSummary(100), pointsStore.fetchLeaderboard(50)]);
  }
});

// Helper function to determine if a user is the current user
const isCurrentUser = (username: string) => {
  return username === authStore.username;
};

const refreshProfilePic = async () => {
  await profilePicStore.fetchUserProfilePic();
  profilePicUpdateTrigger.value = Date.now();
};

// Computed properties for user stats
const userStreak = computed(() => pointsStore.currentStreak);
const userPoints = computed(() => pointsStore.totalPoints);
const completedExercises = computed(() => {
  return (
    pointsStore.recentTransactions?.filter((transaction) => transaction.transactionType === "correct_answer").length ||
    0
  );
});

// Watch for auth state changes
watch(
  () => authStore.isAuthenticated,
  async (isAuthenticated) => {
    if (isAuthenticated) {
      await Promise.all([refreshProfilePic(), pointsStore.fetchPointsSummary(100), pointsStore.fetchLeaderboard(50)]);
    }
  },
);

// Watch route changes
if (process.client) {
  const route = useRoute();
  watch(
    () => route.path,
    () => {
      if (route.path === "/leaderboard" && authStore.isAuthenticated) {
        refreshProfilePic();
      }
    },
  );
}
</script>

<template>
  <div class="page-container flex">
    <!-- Left card - User stats -->
    <div class="flex w-80 flex-col p-6">
      <div class="rounded-lg bg-white p-6 dark:bg-gray-800">
        <div class="mb-8 flex flex-col items-center space-y-4">
          <ProfilePic :key="`profile-pic-${profilePicUpdateTrigger}`" />
          <h2 class="text-primary text-xl font-semibold">Your Points</h2>
        </div>

        <!-- Stats Grid -->
        <div class="mb-6 grid grid-cols-2 gap-4">
          <div class="flex flex-col items-center rounded-lg bg-gray-100 p-3 dark:bg-gray-600">
            <div class="text-sm text-gray-800 dark:text-gray-200">Streak</div>
            <div class="text-xl font-bold text-black dark:text-white">{{ userStreak }}</div>
          </div>
          <div class="flex flex-col items-center rounded-lg bg-gray-100 p-3 dark:bg-gray-600">
            <div class="text-sm text-gray-800 dark:text-gray-200">Points</div>
            <div class="text-xl font-bold text-black dark:text-white">{{ userPoints }}</div>
          </div>
        </div>

        <div class="flex flex-col items-center rounded-lg bg-gray-100 p-3 dark:bg-gray-600">
          <div class="text-sm text-gray-800 dark:text-gray-200">Exercises Completed</div>
          <div class="text-xl font-bold text-black dark:text-white">{{ completedExercises }}</div>
        </div>
      </div>

      <NuxtLink
        to="/dashboard"
        class="bg-primary hover-primary mt-6 w-full rounded-lg px-6 py-3 text-center font-semibold text-white shadow-md transition-colors"
      >
        Back to Dashboard
      </NuxtLink>
    </div>

    <!-- Leaderboard(right card) -->
    <div class="flex-1 p-6">
      <div class="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <h2 class="text-primary mb-6 text-2xl font-bold">Leaderboard</h2>

        <div v-if="pointsStore.loading" class="flex justify-center py-8">
          <div class="text-gray-500">Loading leaderboard...</div>
        </div>

        <div v-else-if="pointsStore.error" class="mt-4 text-center text-red-500">
          {{ pointsStore.error }}
        </div>

        <div v-else-if="pointsStore.leaderboard.length === 0" class="flex justify-center py-8">
          <div class="text-gray-500">No leaderboard data available</div>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="user in pointsStore.leaderboard"
            :key="user.userId"
            class="flex h-16 items-center justify-between rounded-lg bg-gray-100 p-4 dark:bg-gray-600"
            :class="{
              'border-2 border-yellow-500': user.rank === 1,
              'border-2 border-gray-300': user.rank === 2,
              'border-2 border-amber-600': user.rank === 3,
              border: user.rank > 3,
            }"
          >
            <div class="flex items-center space-x-4">
              <span class="w-8 text-center text-xl font-bold text-gray-700 dark:text-white">{{ user.rank }}</span>

              <div v-if="isCurrentUser(user.username)" class="flex-shrink-0">
                <ProfilePic :key="`leaderboard-${user.rank}-${profilePicUpdateTrigger}`" :small="true" />
              </div>
              <div v-else class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-500">
                <img
                  v-if="user.profilePicture && user.profilePicture !== 'custom'"
                  :src="`/images/profilepics/${user.profilePicture}.png`"
                  :alt="user.username"
                  class="h-90 w-90 object-contain p-2"
                />
                <img
                  v-else-if="user.profilePicture === 'custom'"
                  :src="`${useRuntimeConfig().public.apiBase}/users/profilepic?type=image&username=${user.username}`"
                  :alt="user.username"
                  class="h-full w-full object-contain p-1"
                  @error="($event.target as HTMLImageElement).src = '/images/profilepics/default.png'"
                />
                <svg v-else class="h-2 w-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>

              <div class="flex items-center space-x-2">
                <span class="text-lg text-gray-800 dark:text-white">{{ user.username }}</span>
                <span
                  v-if="isCurrentUser(user.username)"
                  class="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100"
                >
                  You
                </span>
              </div>
            </div>

            <span class="text-lg font-semibold text-gray-700 dark:text-white">{{ user.totalPoints }} points</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
