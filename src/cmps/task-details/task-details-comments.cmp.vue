<template>
  <div class="task-details-comments data-layout">
    <h3><font-awesome-icon :icon="['far', 'comment']" /> Comments</h3>
    <div class="flex comment align-center data-layout wrap" v-for="(comment, idx) in comments" :key="idx">
      <user-avatar :user="comment.creator"></user-avatar>
      <div>
        <h4 class="comment-details"><span>{{ comment.creator.fullName }}</span>: {{ comment.txt }}</h4>
        <p>{{date(comment.createdAt)}}</p>
      </div>
    </div>
      <form @submit.prevent="addComment">
                 <textarea
            class="description-textarea"
            contenteditable
            v-model="commentTxt"
            cols="80"
            rows="3"
          ></textarea> 
          <button class="green-btn">Send</button>
      </form>
  </div>
</template>

<script>

import userAvatar from "../user-avatar.cmp";
import moment from 'moment'


export default {
  name: "task-details-comments",
  props: {
      comments: Array
  },
  data() {
    return {
        commentTxt: ''
    };
  },
  methods: {
      addComment(){
        this.$emit('addComment', this.commentTxt)
        this.commentTxt = ''
      },
      date(commentTime){
      const week = 60480000
      const now = Date.now()
      if(now - commentTime < 604800000) return moment(commentTime).fromNow()
      else return moment(commentTime).format('MMM DD, h:mm A')
    }
  },
  computed: {

  },
  components:{
    userAvatar
  },
  created(){

  }
};
</script>