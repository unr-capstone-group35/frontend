
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
    currentProfilePic: null,
    isLoading: false
  }),
  
  actions: {
    async fetchUserProfilePic() {
      this.isLoading = true
      try {
        const { data } = await useAPI().get('/api/users/profilepic')
        this.currentProfilePic = data.profilePicId || 'default'
      } catch (error) {
        console.error('Error fetching profile pic:', error)
        this.currentProfilePic = 'default'
      } finally {
        this.isLoading = false
      }
    },
    
    async updateProfilePic(picId) {
      this.isLoading = true
      try {
        await useAPI().put('/api/users/profilepic', { profilePicId: picId })
        this.currentProfilePic = picId
        return true
      } catch (error) {
        console.error('Error updating profile pic:', error)
        return false
      } finally {
        this.isLoading = false
      }
    }
  }
})