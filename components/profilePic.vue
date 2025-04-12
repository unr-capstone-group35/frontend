<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useProfilePicStore } from "~/stores/profilePicStore"

const props = defineProps({
  size: {
    type: String,
    default: "md",
    validator: (val: string) => ["xs", "sm", "md", "lg", "xl"].includes(val)
  },
  profilePicId: {
    type: String,
    default: null
  },
  editable: {
    type: Boolean,
    default: false
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

// Store
const profilePicStore = useProfilePicStore()

// If provided with a profilePicId, use that, otherwise use the one from the store
const activePicId = computed(() => props.profilePicId || profilePicStore.currentProfilePic || "default")

// Determine if we're using the default pic
const isDefault = computed(() => activePicId.value === "default")

// Get the image URL based on the active pic ID
const profilePic = computed(() => {
  const option = profilePicStore.profilePicOptions.find(opt => opt.id === activePicId.value)
  return option ? option.src : "/images/profilepics/default.png"
})

// Size classes for responsive design - MODIFIED SCALING VALUES EVEN SMALLER
const sizeClasses = computed(() => {
  switch (props.size) {
    case "xs":
      return {
        container: "h-8 w-8",
        imgSize: "h-[75%] w-[75%] object-contain", // Smaller for all images
        icon: "h-5 w-5",
        editButton: "bottom-0 right-0 h-3 w-3",
        imgScale: "h-[70%] w-[70%] transform object-contain" // Even smaller for default icon
      }
    case "sm":
      return {
        container: "h-10 w-10",
        imgSize: "h-[75%] w-[75%] object-contain", // Smaller for all images
        icon: "h-6 w-6",
        editButton: "bottom-0 right-0 h-4 w-4",
        imgScale: "h-[70%] w-[70%] transform object-contain" // Even smaller for default icon
      }
    case "lg":
      return {
        container: "h-16 w-16",
        imgSize: "h-[75%] w-[75%] object-contain", // Smaller for all images
        icon: "h-10 w-10",
        editButton: "bottom-0 right-0 h-6 w-6",
        imgScale: "h-[70%] w-[70%] transform object-contain" // Even smaller for default icon
      }
    case "xl":
      return {
        container: "h-24 w-24",
        imgSize: "h-[75%] w-[75%] object-contain", // Smaller for all images
        icon: "h-16 w-16",
        editButton: "bottom-0 right-0 h-7 w-7",
        imgScale: "h-[70%] w-[70%] transform object-contain" // Even smaller for default icon
      }
    default: // md
      return {
        container: "h-12 w-12",
        imgSize: "h-[75%] w-[75%] object-contain", // Smaller for all images
        icon: "h-8 w-8",
        editButton: "bottom-0 right-0 h-5 w-5",
        imgScale: "h-[70%] w-[70%] transform object-contain" // Even smaller for default icon
      }
  }
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
        sizeClasses.container,
        'flex items-center justify-center overflow-hidden rounded-full border border-gray-300 bg-gray-200 dark:border-gray-600 dark:bg-gray-700'
      ]"
    >
      <!-- If there's a selected profile pic and no error loading it -->
      <img
        v-if="profilePic && !imageError"
        :src="profilePic"
        :alt="'Profile picture'"
        :class="[isDefault ? sizeClasses.imgScale : sizeClasses.imgSize]"
        @error="handleImageError"
        @load="handleImageLoad"
      />

      <!-- Fallback SVG icon if image fails to load -->
      <svg v-else :class="[sizeClasses.icon, 'text-gray-400']" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
      </svg>
    </div>

    <!-- Edit Button Overlay -->
    <button
      v-if="editable"
      @click.stop="handleEditClick"
      :class="[
        sizeClasses.editButton,
        'absolute flex items-center justify-center rounded-full bg-emerald-500 text-white shadow-md transition-colors hover:bg-emerald-600'
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
