<template>
  <div id="app" class="dark:bg-gray-900">
    <Header /> 
    <NuxtPage />  
    <Footer /> 
  </div>
</template>

<script>
import Header from './components/Header.vue';  // Import header component
import Footer from './components/Footer.vue';  // Import footer component

export default {
  components: {
    Header,
    Footer,
  },
};
</script>

<style>
/* Global styles here */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  background-color: white;
}


:root.dark body {
  background-color: rgb(17 24 39); /* to make sure when scrolling past page it's same color */
}

</style>
