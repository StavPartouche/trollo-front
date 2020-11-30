<template>
  <div class="task-details-comments">
    <h3>Comments</h3>
    <div class="flex comment align-center" v-for="(comment, idx) in comments" :key="idx">
      <user-avatar :user="comment.creator"></user-avatar>
      <h4 class="comment-creator">{{ comment.creator.fullName }}: </h4>
      <p class="comment-txt">{{ comment.txt }}</p>
    </div>
      <form @submit.prevent="addComment">
          <input class="comment-input" type="text" placeholder="Write a comment" v-model="commentTxt">
          <button>Send</button>
      </form>
  </div>
</template>

<script>

import userAvatar from "../user-avatar.cmp";

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