
<template>
  <div>
    <div class="create-url">
      <label for="create-url">Insert your own url:</label>
      <input type="text" id="create-url" v-model="new_url" placeholder="long url">
      <button v-on:click="createUrl">Create short version</button>
    </div>
    <p class="error" v-if="error">{{error}}</p>
    <p class="text" v-if="!url_list"> {{`Loading...`}} </p>
    <div v-if="url_list">
      <div class="url" 
        v-for="(url_object, index) in url_list"
        @mouseover="hover_id = url_object._id"
        @mouseleave="hover_id = 'false'"
        v-bind:item="url_object"
        v-bind:index="index"
        v-bind:key="url_object._id"
        v-on:dblclick="deleteUrl(url_object._id)"
      >
        {{`${url_object.createdAt.getDate()}/${url_object.createdAt.getMonth()}/${url_object.createdAt.getFullYear()}`}}
        <p class="text"> {{`Original url:`}} </p><a class="text" v-bind:href="url_object.url"> {{url_object.url}} </a>
        <p class="text"> {{`Shorted url:`}} </p><a class="text" v-bind:href="url_object.url"> {{url_object.short_url}} </a>
        <p class="text" v-if="(hover_id===url_object._id)">CLICK HERE TO DELETE</p>
      </div>
    </div>
  </div>
</template>


<script>

import UrlService from "../modules/UrlService.js"

export default {
  name: 'UrlUserList',
  props: ['url_list', 'error'],
  data(){
    return{
      hover_id:"",
      new_url:"",
    }
  },
  
  methods:{
    async createUrl(){
      await UrlService.createNewUrl(this.new_url)
      this.$emit('update_urls')
    },
    async deleteUrl(mongo_id){
      try {
        await UrlService.deleteUrl(mongo_id)
        this.$emit('update_urls')
      } catch (error) {
        this.$emit('update_error', error)
      }
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

div.create-url {
  margin: 6px;
}
div.create-url > *{
  margin: 4px;
}

p.error { 
  border: 1px solid #ff5b5f; 
  background-color: #ffc5c1; 
  padding: 10px; 
  margin-bottom: 15px; 
  }

div.url { 
  position: relative; 
  border: 1px solid #5bd658;
  background-color: #b0e9b7; 
  padding: 10px 10px 30px 10px; 
  margin-bottom: 15px; 
  }
div.url:hover {
  border: 1px solid #4ebb4d;
  background-color: #93c999; 
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
