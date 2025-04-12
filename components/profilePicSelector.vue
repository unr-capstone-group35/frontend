<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { useProfilePicStore } from "~/stores/profilePicStore"

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(["update:modelValue"])

// Component state
const isSubmitting = ref(false)
const uploadedImage = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const isUploadOption = ref(false)
const selectedPicId = ref<string | null>(null)
const selectedPicSrc = ref<string | null>(null)

// Store
const profilePicStore = useProfilePicStore()
const profilePicOptions = computed(() => profilePicStore.profilePicOptions)

// Initialize the selected pic to the current one
const getActivePicId = computed(() => {
  return selectedPicId.value || profilePicStore.currentProfilePic || "default"
})

// Watch for model changes to reset state
watch(
  () => props.modelValue,
  newVal => {
    if (newVal) {
      // When opening, reset to current pic
      selectedPicId.value = profilePicStore.currentProfilePic
      isUploadOption.value = false
    }
  }
)

// Close the modal
const closeModal = () => {
  emit("update:modelValue", false)
}

// Prevent click events from bubbling to parent (which would close the modal)
const preventClose = (e: Event) => {
  e.stopPropagation()
}

// Select a picture
const selectPicture = (id: string, src: string) => {
  selectedPicId.value = id
  selectedPicSrc.value = src
  isUploadOption.value = false
}

// Select the upload option
const selectUploadOption = () => {
  isUploadOption.value = true
  selectedPicId.value = "upload"
  if (fileInput.value) {
    fileInput.value.click()
  }
}

// Handle file upload
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target && target.files && target.files.length > 0) {
    const file = target.files[0]

    // Validation - only accept images under 2MB
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file")
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size cannot exceed 2MB")
      return
    }

    // Create a preview
    const reader = new FileReader()
    reader.onload = e => {
      uploadedImage.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// Apply the selection
const applySelection = async () => {
  isSubmitting.value = true

  try {
    // Different handling based on whether it's a predefined pic or upload
    if (isUploadOption.value && fileInput.value?.files?.length) {
      // For Phase 1, we'll just use predefined pics
      // This will be implemented in Phase 2
      alert("Custom image uploads will be available soon!")
      isSubmitting.value = false
      return
    } else if (selectedPicId.value) {
      // Update with predefined pic
      const success = await profilePicStore.updateProfilePic(selectedPicId.value)
      if (success) {
        closeModal()
      } else {
        alert("Failed to update profile picture. Please try again.")
      }
    }
  } catch (error) {
    console.error("Error applying selection:", error)
    alert("An error occurred. Please try again.")
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      @click="closeModal"
    >
      <div class="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl dark:bg-gray-800" @click="preventClose">
        <!-- Header -->
        <div class="border-b border-gray-200 px-6 py-3 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Choose Profile Picture</h2>
            <button
              @click="closeModal"
              class="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Picture Grid -->
        <div class="p-4">
          <div class="grid grid-cols-4 gap-3">
            <!-- Default option -->
            <div
              class="cursor-pointer transition-all duration-200"
              :class="
                getActivePicId === 'default' ? 'scale-105 ring-2 ring-emerald-500 ring-offset-2' : 'hover:scale-105'
              "
              @click="selectPicture('default', '/images/profilepics/default.png')"
            >
              <div
                class="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700"
              >
                <img
                  src="/images/profilepics/default.png"
                  alt="Default profile"
                  class="h-full w-full object-contain p-1"
                />
              </div>
              <p class="mt-1 text-center text-xs font-medium text-gray-600 dark:text-gray-300">Default</p>
            </div>

            <!-- Upload option -->
            <div
              class="cursor-pointer transition-all duration-200"
              :class="
                getActivePicId === 'upload' ? 'scale-105 ring-2 ring-emerald-500 ring-offset-2' : 'hover:scale-105'
              "
              @click="selectUploadOption"
            >
              <div
                class="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700"
              >
                <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileUpload" />

                <!-- Show the uploaded image if available -->
                <template v-if="uploadedImage && isUploadOption">
                  <img :src="uploadedImage" class="h-full w-full object-cover" alt="Uploaded image" />
                </template>

                <!-- Otherwise show the upload icon -->
                <template v-else>
                  <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"
                    />
                  </svg>
                </template>
              </div>
              <p class="mt-1 text-center text-xs font-medium text-gray-600 dark:text-gray-300">Upload</p>
            </div>

            <!-- Profile picture options -->
            <div
              v-for="pic in profilePicOptions.filter(p => p.id !== 'default')"
              :key="pic.id"
              class="cursor-pointer transition-all duration-200"
              :class="getActivePicId === pic.id ? 'scale-105 ring-2 ring-emerald-500 ring-offset-2' : 'hover:scale-105'"
              @click="selectPicture(pic.id, pic.src)"
            >
              <div
                class="flex aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700"
              >
                <img v-if="pic.src" :src="pic.src" :alt="pic.label" class="h-full w-full object-contain p-1" />
              </div>
              <p class="mt-1 text-center text-xs font-medium text-gray-600 dark:text-gray-300">{{ pic.label }}</p>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div
          class="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-700 dark:bg-gray-800"
        >
          <button
            @click="closeModal"
            class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            :disabled="isSubmitting"
          >
            Cancel
          </button>
          <button
            @click="applySelection"
            class="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting">Saving...</span>
            <span v-else>Apply</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
