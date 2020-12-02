<template>
  <div class="task-details-comments">
    <h3>Comments</h3>
    <div class="flex comment align-center data-layout" v-for="(comment, idx) in comments" :key="idx">
      <user-avatar :user="comment.creator"></user-avatar>
      <h4 class="comment-creator">{{ comment.creator.fullName }}: </h4>
      <p class="comment-txt">{{ comment.txt }}</p>
      <p>{{date(comment.createdAt)}}</p>
    </div>
      <form @submit.prevent="addComment">
          <input class="comment-input data-layout" type="text" placeholder="Write a comment" v-model="commentTxt">
          <button>Send</button>
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