<template>
  <div v-if="user" :style="avatarSize">
  <avatar :size="width" v-if="!user.imgUrl" :username="user.fullName"></avatar>
  <el-avatar v-else :size="width" :src="user.imgUrl"></el-avatar>
  </div>
</template>

<script>
import Avatar from "vue-avatar";
export default {
  name: "board-members",
  props: {
    user: Object,
    width: {
        type: Number,
        default: 28
  },
  },
  data() {
    return {};
  },
  methods: {},
  computed: {
      avatarSize(){
          return `height: ${this.width}px`
      }
  },
  components: {
    Avatar,
  },
}
</script>