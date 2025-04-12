

export const useProfilePicStore = defineStore('profilePic', {
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
      { id: "default", src: "/images/profilepics/default.png", label: "Default" }
    ],
    currentProfilePic: null as string | null,
    isLoading: false
  }),
  
  getters: {
    // Get the URL for the current profile pic
    currentProfilePicUrl: (state) => {
      if (!state.currentProfilePic) return '/images/profilepics/default.png'
      
      if (state.currentProfilePic === 'custom') {
        // For custom uploads, we need to fetch from the API with a cache buster
        return `http://localhost:8080/api/users/profilepic?type=image&t=${Date.now()}`
      }
      
      const option = state.profilePicOptions.find(opt => opt.id === state.currentProfilePic)
      return option ? option.src : '/images/profilepics/default.png'
    }
  },
  
  actions: {
    // Fetch the user's profile pic ID from the API
    async fetchUserProfilePic() {
      this.isLoading = true
      try {
        const authStore = useAuthStore()
        const token = authStore.token
        
        // Use the correct backend URL
        const response = await fetch('http://localhost:8080/api/users/profilepic', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile picture')
        }
        
        const data = await response.json()
        this.currentProfilePic = data.profilePicId || 'default'
        return this.currentProfilePic
      } catch (error) {
        console.error('Error fetching profile pic:', error)
        this.currentProfilePic = 'default'
        return 'default'
      } finally {
        this.isLoading = false
      }
    },
    
    // Update the user's profile pic ID
    async updateProfilePic(picId: string) {
      this.isLoading = true
      try {
        const authStore = useAuthStore()
        const token = authStore.token
        
        const response = await fetch('http://localhost:8080/api/users/profilepic', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ profilePicId: picId })
        })
        
        if (!response.ok) {
          throw new Error('Failed to update profile picture')
        }
        
        this.currentProfilePic = picId
        return true
      } catch (error) {
        console.error('Error updating profile pic:', error)
        return false
      } finally {
        this.isLoading = false
      }
    },
    
    // Upload a custom profile picture
    async uploadCustomProfilePic(file: File) {
      this.isLoading = true
      try {
        const formData = new FormData()
        formData.append('profilePic', file)
        
        const authStore = useAuthStore()
        const token = authStore.token
        
        const response = await fetch('http://localhost:8080/api/users/profilepic/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })
        
        if (!response.ok) {
          throw new Error('Failed to upload profile picture')
        }
        
        this.currentProfilePic = 'custom'
        return true
      } catch (error) {
        console.error('Error uploading profile pic:', error)
        return false
      } finally {
        this.isLoading = false
      }
    }
  }
})