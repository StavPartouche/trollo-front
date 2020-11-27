<template>
  <div class="task-details-comments">
    <h3>Commentsssssss</h3>
    <div v-for="(comment, idx) in comments" :key="idx">
      <h4>By: {{ comment.creator }}</h4>
      <p>{{ comment.txt }}</p>
    </div>
      <form @submit.prevent="addComment">
          <input type="text" placeholder="Comment" v-model="commentTxt">
          <button>Send</button>
      </form>
  </div>
</template>

<script>
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
      }
  },
  computed: {},
  created(){
      console.log(this.comments);
  }
};
</script>