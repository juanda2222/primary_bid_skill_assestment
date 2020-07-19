
<template>
  <div class="posts-container">
    <p class="error" v-if="error">{{error}}</p>
    <p class="text" v-if="isLoading"> {{`Loading...`}} </p>
    <div v-if="!isLoading">
      <div class="post"
        v-for="(post, index) in posts"
        v-bind:item="post"
        v-bind:index="index"
        v-bind:key="post._id"
      >
        {{`${post.createdAt.getDate()}/${post.createdAt.getMonth()}/${post.createdAt.getFullYear()}`}}
        <p class="text"> {{`Original url:`}} </p><a class="text"> {{post.url}} </a>
        <p class="text"> {{`Shorted url:`}} </p><a class="text  "> {{post.short_url}} </a>
      </div>
    </div>
  </div>
</template>


<script>

import UrlService from "../modules/UrlService.js"

export default {
  name: 'UrlListConponent',
  data(){
    return{
      posts:[],
      error:"",
      text:"",
      isLoading:true,
    }
  },
  async created(){
    try {
      this.posts = await UrlService.getUrls()
      this.isLoading = false
    } catch (error) {
      this.error = error
    }
  },
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

p.error { 
  border: 1px solid #ff5b5f; 
  background-color: #ffc5c1; 
  padding: 10px; 
  margin-bottom: 15px; 
  }

div.post { 
  position: relative; 
  border: 1px solid #5bd658;
  background-color: #b0e9b7; 
  padding: 10px 10px 30px 10px; 
  margin-bottom: 15px; 
  }

div.created-at { 
  position: absolute; 
  top: 0; 
  left: 0; 
  padding: 5px 15px 5px 15px; 
  background-color: darkgreen; 
  }

p.text { 
  font-size:15px; 
  font-weight: 700; 
  margin-bottom: 0; 
  }
  
</style>
