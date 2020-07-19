<template>
  <div id="app">
    <img class="personal_logo" alt="David logo" src="./assets/logo.png">
    <UrlListContainer/>
  </div>
</template>
<script>

import UrlListContainer from './components/UrlListContainer.vue'

export default {
  name: 'App',
  components: {
    UrlListContainer
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
