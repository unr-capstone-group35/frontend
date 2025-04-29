export const useProfilePicStore = defineStore("profilePic", {
  state: () => ({
    profilePicOptions: [
      { id: "devquest-bird", src: "/images/profilepics/DevQuest-bird.png", label: "DevQuest Bird" },
      { id: "fox", src: "/images/profilepics/fox.png", label: "Fox" },
      { id: "crocodile", src: "/images/profilepics/crocodile.png", label: "Crocodile" },
      { id: "koala", src: "/images/profilepics/koala.png", label: "Koala" },
      { id: "parrot", src: "/images/profilepics/parrot.png", label: "Parrot" },
      { id: "sea-turtle", src: "/images/profilepics/sea-turtle.png", label: "Sea Turtle" },
      { id: "whale", src: "/images/profilepics/whale.png", label: "Whale" },
      { id: "owl", src: "/images/profilepics/owl.png", label: "Owl" },
      { id: "shark", src: "/images/profilepics/shark.png", label: "Shark" },
      { id: "default", src: "/images/profilepics/default.png", label: "Default" },
    ],
    currentProfilePic: null as string | null,
    customImageVersion: Date.now(), // Initialize with current timestamp
    isLoading: false,
  }),

  getters: {
    // Get the URL for the current profile pic
    currentProfilePicUrl: (state) => {
      console.log("Getting currentProfilePicUrl with currentProfilePic:", state.currentProfilePic);

      if (!state.currentProfilePic) {
        console.log("No current profile pic, returning default");
        return "/images/profilepics/default.png";
      }

      if (state.currentProfilePic === "custom") {
        // For custom uploads, we need to fetch from the API with a version parameter
        const url = `${useRuntimeConfig().public.apiBase}/users/profilepic?type=image&v=${state.customImageVersion}`;
        console.log("Using custom profile pic URL:", url);
        return url;
      }

      const option = state.profilePicOptions.find((opt) => opt.id === state.currentProfilePic);
      console.log("Found profile pic option:", option);
      return option ? option.src : "/images/profilepics/default.png";
    },
  },

  actions: {
    // Fetch the user's profile pic ID from the API
    async fetchUserProfilePic() {
      console.log("Fetching user profile pic");
      this.isLoading = true;
      try {
        const authStore = useAuthStore();
        // Check if user is logged in before trying to fetch profile
        if (!authStore.isAuthenticated || !authStore.token) {
          console.log("User not authenticated, returning default profile");
          this.currentProfilePic = "default";
          return "default";
        }

        const token = authStore.token;
        console.log("Auth token exists:", !!token);

        // Use the correct backend URL
        const response = await fetch(`${useRuntimeConfig().public.apiBase}/users/profilepic`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Fetch response status:", response.status);

        if (!response.ok) {
          throw new Error(`Failed to fetch profile picture: ${response.status}`);
        }

        const data = await response.json();
        console.log("Received profile pic data:", data);
        this.currentProfilePic = data.profilePicId || "default";

        // Update version when fetching
        if (this.currentProfilePic === "custom") {
          this.customImageVersion = Date.now();
        }

        console.log("Set currentProfilePic to:", this.currentProfilePic, "with version:", this.customImageVersion);
        return this.currentProfilePic;
      } catch (error) {
        console.error("Error fetching profile pic:", error);
        this.currentProfilePic = "default";
        return "default";
      } finally {
        this.isLoading = false;
      }
    },

    // Update the user's profile pic ID
    async updateProfilePic(picId: string) {
      console.log("Updating profile pic to:", picId);
      this.isLoading = true;
      try {
        const authStore = useAuthStore();
        const token = authStore.token;

        const response = await fetch(`${useRuntimeConfig().public.apiBase}/users/profilepic`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ profilePicId: picId }),
        });

        console.log("Update response status:", response.status);

        if (!response.ok) {
          throw new Error(`Failed to update profile picture: ${response.status}`);
        }

        this.currentProfilePic = picId;
        console.log("Successfully updated profile pic to:", picId);
        return true;
      } catch (error) {
        console.error("Error updating profile pic:", error);
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    // Upload a custom profile picture
    async uploadCustomProfilePic(file: File, timestamp?: number) {
      console.log("Uploading custom profile pic:", file.name, "Size:", file.size, "Type:", file.type);
      this.isLoading = true;

      // Generate new version timestamp before upload or use provided timestamp
      const newVersion = timestamp || Date.now();
      console.log("Using timestamp for version:", newVersion);

      try {
        const formData = new FormData();
        formData.append("profilePic", file);

        const authStore = useAuthStore();
        const token = authStore.token;
        console.log("Auth token exists for upload:", !!token);

        console.log("Sending upload request to /api/users/profilepic/upload");

        //this should be $fetch
        const response = await fetch(`${useRuntimeConfig().public.apiBase}/users/profilepic/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        console.log("Upload response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response text:", errorText);

          // 403 probably means google detected inappropriate material
          if (response.status === 403) {
            throw new Error("This image contains inappropriate content and cannot be used as a profile picture.");
          } else if (response.status === 500 && errorText.includes("Failed to detect safe search")) {
            throw new Error("Failed to detect safe search. The service may be temporarily unavailable.");
          } else {
            throw new Error(`Failed to upload profile picture: ${response.status}`);
          }
        }

        const data = await response.json();
        console.log("Upload response data:", data);

        this.currentProfilePic = "custom";
        // Use the timestamp we generated before the upload
        this.customImageVersion = newVersion;
        console.log("Set currentProfilePic to 'custom' with version:", this.customImageVersion);

        const event = new CustomEvent("profile-pic-updated", {
          detail: { type: "custom", version: this.customImageVersion },
        });
        window.dispatchEvent(event);

        return true;
      } catch (error) {
        console.error("Error uploading profile pic:", error);
        throw error; // Re-throw so the component can handle it
      } finally {
        this.isLoading = false;
      }
    },
  },
});
