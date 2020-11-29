<template>
      <li v-if="member._id !== 'guest'"  class="userToShow user-card-container">
            <div @click="togggleMember" :class="{'disable-page-container': showMember}"></div>
      <user-avatar @click.native="togggleMember" :user="member"></user-avatar>
        <!-- <button @click="togggleMember">{{ member.userName}} </button> -->
    <div v-if="showMember"  class="user-card flex-column">
            <h4>{{member.userName}}</h4>
            <p>{{member.fullName}}</p>
            <!-- <h3>{{member.fullName}}</h3> -->
            <button @click="removeBoardMember(member._id)"><i class="fas fa-trash"></i></button>
        </div>
      </li>
</template>

<script>
import userAvatar from '../user-avatar.cmp'
export default {
  name: "board-members",
  props: {
    member: Object,
  },
  data() {
    return {
      showMember:false
    };
  },
  methods: {
    removeBoardMember(memberId){
this.$emit("removeBoardMember", memberId);
    },
    togggleMember() {
        this.showMember= !this.showMember
    //   console.log(member);
    },
  },
  computed: {
  },
  components:{
    userAvatar
  }
};
</script>