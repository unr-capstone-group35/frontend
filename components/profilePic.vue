<script setup lang="ts">
const props = defineProps({
  small: {
    type: Boolean,
    default: false
  },
  editable: {
    type: Boolean,
    default: false
  },
  profilePicId: {
    type: String,
    default: null
  },
  userId: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(["editClick"])

// Component state
const imageError = ref(false)
const isLoading = ref(false)

const profilePicStore = useProfilePicStore()

const activePicId = computed(() => props.profilePicId || profilePicStore.currentProfilePic || "default")

const isDefault = computed(() => activePicId.value === "default")

const profilePic = computed(() => {
  const option = profilePicStore.profilePicOptions.find(opt => opt.id === activePicId.value)
  return option ? option.src : "/images/profilepics/default.png"
})

// Container and image sizes based on small prop
const containerClass = computed(() => {
  return props.small
    ? "h-10 w-10" // Small size for leaderboard
    : "h-24 w-24" // Normal size for profile/dashboard
})

const imageClass = computed(() => {
  // Base image class with appropriate scaling
  const baseClass = isDefault.value ? "transform object-contain" : "object-contain"

  // Scale percentages based on size and type
  const scaleClass = isDefault.value
    ? props.small
      ? "h-[65%] w-[65%]"
      : "h-[70%] w-[70%]"
    : props.small
      ? "h-[70%] w-[70%]"
      : "h-[75%] w-[75%]"

  return `${baseClass} ${scaleClass}`
})

// Edit button size
const editButtonClass = computed(() => {
  return props.small ? "absolute bottom-0 right-0 h-4 w-4" : "absolute bottom-0 right-0 h-7 w-7"
})

// Image error handling
const handleImageError = () => {
  imageError.value = true
}

const handleImageLoad = () => {
  imageError.value = false
}

// Edit button handler
const handleEditClick = () => {
  emit("editClick")
}

// Load profile pic on mount if not already specified
onMounted(() => {
  if (!props.profilePicId && !profilePicStore.currentProfilePic) {
    profilePicStore.fetchUserProfilePic()
  }
})
</script>

<template>
  <div class="profile-pic-component relative inline-block" :class="{ 'opacity-50': isLoading }">
    <!-- Profile Picture Container -->
    <div
      :class="[
        containerClass,
        'flex items-center justify-center overflow-hidden rounded-full border border-gray-300 bg-gray-200 dark:border-gray-600 dark:bg-gray-700'
      ]"
    >
      <!-- If there's a selected profile pic and no error loading it -->
      <img
        v-if="profilePic && !imageError"
        :src="profilePic"
        :alt="'Profile picture'"
        :class="imageClass"
        @error="handleImageError"
        @load="handleImageLoad"
      />

      <!-- Fallback SVG icon if image fails to load -->
      <svg v-else :class="[small ? 'h-6 w-6' : 'h-16 w-16', 'text-gray-400']" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
      </svg>
    </div>

    <!-- Edit Button Overlay -->
    <button
      v-if="editable"
      @click.stop="handleEditClick"
      :class="[
        editButtonClass,
        'flex items-center justify-center rounded-full bg-emerald-500 text-white shadow-md transition-colors hover:bg-emerald-600'
      ]"
      title="Change profile picture"
    >
      <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        ></path>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.profile-pic-component {
  transition: opacity 0.2s;
}
</style>
