<template>
  <div class="container" >
    <h1>Your url's</h1>
    
    <UrlList/>
  </div>
</template>
<script>

import UrlList from "./UrlList.vue"

export default {
  name: 'UrlListContainer',
  components: {
    UrlList
  },
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

div.container { 
  max-width: 800px; 
  margin: 0 auto; 
  }  
</style>
