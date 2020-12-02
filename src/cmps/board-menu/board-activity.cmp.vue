<template>
  <li class="activity" v-if="user">
    <user-avatar :user="user"></user-avatar>
    <div class="activity-details">
      <p class="activity-desc"><span>{{user.fullName}}</span> {{activity.txt}}</p>
      <!-- <p class="activity-date">{{date}}</p> -->
      <p class="activity-date">{{ activity.createdAt | moment("MMM Do, h:mm A") }}</p>
    </div>
  </li>
</template>

<script>

import { userService } from '../../services/user.service'
import userAvatar from "../user-avatar.cmp";

export default {
  name: "boardActivity",
  props: {
      activity: Object
  },
  data() {
    return {
      user: null
    };
  },
  methods: {
      
  },
  computed:{
    // date(){
    //  return  this.activity.createdAt | moment("dddd, MMMM Do YYYY, h:mm:ss a") 
    // }
  },
  components:{
    userAvatar
  },
  async created() {
    const user = await userService.getById(this.activity.userId)
    this.user = user
  },
};
</script>