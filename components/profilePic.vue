<script setup lang="ts">
const props = defineProps({
  small: {
    type: Boolean,
    default: false,
  },
  editable: {
    type: Boolean,
    default: false,
  },
  profilePicId: {
    type: String,
    default: null,
  },
  userId: {
    type: Number,
    default: null,
  },
});

const emit = defineEmits(["editClick"]);

// Component state
const imageError = ref(false);
const isLoading = ref(false);
const imageUrl = ref<string | null>(null);
const localVersion = ref(0); // Local version tracking

const profilePicStore = useProfilePicStore();
const authStore = useAuthStore(); // Import auth store to get the token

const activePicId = computed(() => props.profilePicId || profilePicStore.currentProfilePic || "default");

// Get the custom image version from store
const customImageVersion = computed(() => profilePicStore.customImageVersion);

const isDefault = computed(() => activePicId.value === "default");
const isCustom = computed(() => activePicId.value === "custom");

// For standard profile pictures
const profilePic = computed(() => {
  // Don't use this for custom images
  if (isCustom.value) {
    return null;
  }

  const option = profilePicStore.profilePicOptions.find((opt) => opt.id === activePicId.value);
  return option ? option.src : "/images/profilepics/default.png";
});

// Container and image sizes based on small prop
const containerClass = computed(() => {
  return props.small
    ? "h-10 w-10" // Small size for leaderboard
    : "h-24 w-24"; // Normal size for profile/dashboard
});

const imageClass = computed(() => {
  const baseClass = "transform object-contain";

  const scaleClass = props.small ? "h-[65%] w-[65%]" : "h-[70%] w-[70%]";

  return `${baseClass} ${scaleClass}`;
});

// Edit button size
const editButtonClass = computed(() => {
  return props.small ? "absolute bottom-0 right-0 h-4 w-4" : "absolute bottom-0 right-0 h-7 w-7";
});

// Image error handling
const handleImageError = () => {
  console.error("Image loading error for:", isCustom.value ? "custom image" : profilePic.value);
  imageError.value = true;
};

const handleImageLoad = () => {
  console.log("Image loaded successfully:", isCustom.value ? "custom image" : profilePic.value);
  imageError.value = false;
};

// Edit button handler
const handleEditClick = () => {
  emit("editClick");
};

// Custom method to load custom profile images with authentication
const loadCustomProfileImage = async () => {
  if (!isCustom.value) return;

  try {
    const token = authStore.token;
    console.log("Loading custom profile image with auth token");

    // Clean up previous object URL if it exists
    if (imageUrl.value) {
      URL.revokeObjectURL(imageUrl.value);
      imageUrl.value = null;
    }

    // Update local version from store
    localVersion.value = profilePicStore.customImageVersion;

    // Create a fetch request with authentication - use version parameter to prevent caching
    const response = await fetch(`http://localhost:8080/api/users/profilepic?type=image&v=${localVersion.value}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Failed to load custom profile image:", response.status);
      imageError.value = true;
      return;
    }

    // Convert the response to a blob and create an object URL
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    // Set the image URL
    imageUrl.value = url;
    console.log("Custom image loaded successfully with version:", localVersion.value);
    imageError.value = false;
  } catch (error) {
    console.error("Error loading custom profile image:", error);
    imageError.value = true;
  }
};

// Handle profile-pic-updated event
const handleProfilePicUpdated = (event: CustomEvent) => {
  console.log("Profile pic updated event received:", event.detail);
  if (event.detail.type === "custom" && isCustom.value) {
    // Force reload the custom image
    loadCustomProfileImage();
  }
};

// Clean up object URLs and event listeners when component is unmounted
onUnmounted(() => {
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value);
  }
  window.removeEventListener("profile-pic-updated", handleProfilePicUpdated as EventListener);
});

// Load profile pic on mount and set up event listener
onMounted(() => {
  // Set up event listener for custom profile pic updates
  window.addEventListener("profile-pic-updated", handleProfilePicUpdated as EventListener);

  if (!props.profilePicId && !profilePicStore.currentProfilePic) {
    profilePicStore.fetchUserProfilePic().then(() => {
      // If it's a custom pic, load it with authentication
      if (profilePicStore.currentProfilePic === "custom") {
        loadCustomProfileImage();
      }
    });
  } else if (isCustom.value) {
    // If already set to custom, load it immediately
    loadCustomProfileImage();
  }
});

// Watch for changes to activePicId and customImageVersion
watch([activePicId, customImageVersion], ([newPicId, newVersion], [oldPicId, oldVersion]) => {
  console.log(`ProfilePic watch triggered - ID: ${oldPicId} -> ${newPicId}, Version: ${oldVersion} -> ${newVersion}`);

  if (newPicId === "custom") {
    // If switching to custom or custom version changed, reload the image
    if (oldPicId !== "custom" || newVersion !== oldVersion) {
      // Force reload by updating local version
      localVersion.value = newVersion;
      loadCustomProfileImage();
    }
  }
});
</script>

<template>
  <div class="profile-pic-component relative inline-block" :class="{ 'opacity-50': isLoading }">
    <!-- Profile Picture Container -->
    <div
      :class="[
        containerClass,
        'flex items-center justify-center overflow-hidden rounded-full border border-gray-300 bg-gray-200 dark:border-gray-600 dark:bg-gray-700',
      ]"
    >
      <!-- Standard profile pic -->
      <img
        v-if="!isCustom && profilePic && !imageError"
        :src="profilePic"
        :alt="'Profile picture'"
        :class="imageClass"
        @error="handleImageError"
        @load="handleImageLoad"
      />

      <!-- Custom profile pic loaded with authentication -->
      <img
        v-else-if="isCustom && imageUrl && !imageError"
        :src="imageUrl"
        :alt="'Custom profile picture'"
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
        'flex items-center justify-center rounded-full bg-emerald-500 text-white shadow-md transition-colors hover:bg-emerald-600',
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
