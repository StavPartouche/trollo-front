<template>
  <li class="userToShow user-card-container">
    <!-- <li v-if="member._id !== 'guest'"  class="userToShow user-card-container"> -->
    <div @click="closeMember" :class="{'disable-page-container': showMember}"></div>
    <user-avatar @click.native="openMember" :user="member"></user-avatar>
    <div v-if="showMember" class="user-card flex-column">
      <h4>{{ member.userName }}</h4>
      <p>{{ member.fullName }}</p>
      <button @click="removeBoardMember(member._id)">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  </li>
</template>

<script>
import userAvatar from "../user-avatar.cmp";
export default {
  name: "board-members",
  props: {
    member: Object,
  },
  data() {
    return {
      showMember: false,
    };
  },
  methods: {
    removeBoardMember(memberId) {
      this.$emit("removeBoardMember", memberId);
    },
    openMember() {
      this.showMember = true;
    },
    closeMember() {
      this.showMember = false;
    },
  },
  computed: {},
  components: {
    userAvatar,
  },
  created() {
  },
  created() {
  },
};
</script>