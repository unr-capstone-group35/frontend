<template>
  <div id="app" class="min-h-screen dark:bg-gray-900">
    <div
      class="fixed left-0 right-0 top-0 z-50 bg-white shadow-md dark:bg-gray-900"
    >
      <Header />
    </div>
    <div class="pt-16">
      <!-- Add padding top to account for fixed header -->
      <NuxtPage />
    </div>
  </div>
</template>

<script>
import Header from "./components/Header.vue"

export default {
  components: {
    Header
  }
}
</script>

<style>
body {
  margin: 0;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
    "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  background-color: white;
}

:root.dark body {
  background-color: rgb(17 24 39);
}
</style>
