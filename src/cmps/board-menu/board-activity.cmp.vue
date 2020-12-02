<template>
  <li class="activity" v-if="user">
    <user-avatar :user="user"></user-avatar>
    <div class="activity-details">
      <p class="activity-desc"><span>{{user.fullName}}</span> {{activity.txt}}</p>
      <!-- <p class="activity-date">{{date}}</p> -->
      <p class="activity-date">{{ date }}</p>
    </div>
  </li>
</template>

<script>

import { userService } from '../../services/user.service'
import userAvatar from "../user-avatar.cmp";
import moment from 'moment'

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
    date(){
      const week = 604800000
      const actTime = this.activity.createdAt
      const now = Date.now()
      if(now - actTime < 604800000) return moment(actTime).fromNow()
      else return moment(actTime).format('MMM DD, h:mm A')
    },
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