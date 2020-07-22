<template>
  <div id="app">
    <img class="personal_logo" alt="David logo" src="./assets/logo.png">
    <UrlGridContainer/>
  </div>
</template>
<script>

import UrlGridContainer from './components/UrlGridContainer.vue'

export default {
  name: 'App',
  components: {
    UrlGridContainer
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

</style>
