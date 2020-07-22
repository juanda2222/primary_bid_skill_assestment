<template>
  <div class="container" >
    <div class="user-urls">
      <h1>Your urls</h1>
      <hr>
      <UrlUserList 
        v-bind:url_list="usersUrlList" 
        v-on:update_urls="loadUrls"
        :error="usersError"
        @update_error="usersError=$event"
        />
    </div>
    <div class="all-urls">
      <h1>Other's urls</h1>
      <hr>
      <UrlOthersList 
        v-bind:url_list="othersUrlList" 
        v-on:update_urls="loadUrls"
        :error="othersError"
        @update_error="othersError=$event"        
        />
    </div>    
  </div>
</template>


<script>
import UrlUserList from "./UrlUserList.vue"
import UrlOthersList from "./UrlOthersList.vue"
import UrlService from "../modules/UrlService.js"


export default {
  name: 'UrlGridContainer',
  components: {
    UrlUserList,
    UrlOthersList
  },
  data(){
    return{
      usersUrlList:false,
      usersError:"",
      othersUrlList:false,
      othersError:"",
    }
  },
  async created(){
    try {
      
      this.usersUrlList = []
      this.othersUrlList = []

      const data = await UrlService.getUrls()

      //split into the ones with my user id and the ones that not
      data.UrlList.forEach(element => {
         if (element.userId == data.UserId){ this.usersUrlList.push(element) } // fillter by username
         else {this.othersUrlList.push(element)} //append the rest
      });

    } catch (error) {
      this.usersError = error
      this.othersError = error
    }
  },
  methods:{
    async loadUrls(){
      try {

        let usersUrlList = []
        let othersUrlList = []

        const data = await UrlService.getUrls()

        //split into the ones with my user id and the ones that not
        data.UrlList.forEach(element => {
          if (element.userId == data.UserId){ usersUrlList.push(element) } // fillter by username
          else {othersUrlList.push(element)} //append the rest
        });

        //update
        this.usersUrlList = usersUrlList
        this.othersUrlList = othersUrlList

      } catch (error) {
        this.usersError = error
        this.othersError = error
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

div.container { 
  
  }  
div.user-urls{
  max-width: 900px; 
  margin: 0 auto; 
}
div.all-urls{
  max-width: 900px; 
  margin: 0 auto; 
}

</style>
