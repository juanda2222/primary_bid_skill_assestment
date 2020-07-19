
<template>
  <div>
    <div class="create-url">
      <label for="create-url">Create a url:</label>
      <input type="text" id="create-url" v-model="new_url" placeholder="your url">
      <button v-on:click="createUrl">Create url</button>
    </div>
    <hr>
    <p class="error" v-if="error">{{error}}</p>
    <p class="text" v-if="isLoading"> {{`Loading...`}} </p>
    <div v-if="!isLoading">
      <div class="url"
        v-for="(url_object, index) in url_list"
        v-bind:item="url_object"
        v-bind:index="index"
        v-bind:key="url_object._id"
        v-on:dblclick="deleteUrl(url_object._id)"
      >
        {{`${url_object.createdAt.getDate()}/${url_object.createdAt.getMonth()}/${url_object.createdAt.getFullYear()}`}}
        <p class="text"> {{`Original url:`}} </p><a class="text"> {{url_object.url}} </a>
        <p class="text"> {{`Shorted url:`}} </p><a class="text"> {{url_object.short_url}} </a>
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
      new_url:"",
      url_list:[],
      error:"",
      text:"",
      isLoading:true,
    }
  },
  async created(){
    try {
      this.url_list = await UrlService.getUrls()
      this.isLoading = false
    } catch (error) {
      this.error = error
    }
  },
  methods:{
    async createUrl(){
      await UrlService.createNewUrl(this.new_url)
      this.url_list = await UrlService.getUrls()
    },
    async deleteUrl(mongo_id){
      try {
        await UrlService.deleteUrl(mongo_id)
        this.url_list = await UrlService.getUrls()
      } catch (error) {
        this.error = error
      }
      
    }
  },
  props: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

div.create-url {
  margin: 10px;
}
input.create-url {
  min-width: 100px;
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
