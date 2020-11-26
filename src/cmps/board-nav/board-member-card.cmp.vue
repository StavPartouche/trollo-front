<template>
      <li v-if="member._id !== 'guest'"  class="userToShow user-card-container">
        <button @click="togggleMember">{{ member.userName}} </button>
    <div v-if="showMember"  class="user-card">
            <h5>{{member.userName}}</h5>
            <button @click="removeBoardMember(member._id)">remove user</button>
        </div>
      </li>
</template>

<script>
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
};
</script>