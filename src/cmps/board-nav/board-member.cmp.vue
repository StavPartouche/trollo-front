<template>
  <div class="board-member flex">
    <ul>
      <li
        @click="openUser(member)"
        v-for="member in boardMembers"
        :key="member._id"
      >
        {{ member.userName }}
      </li>
    </ul>
    <button v-if="allMembers" @click="toggleShowInvite">+</button>
    <ul class="invite" v-if="showInvite">
      <li v-for="member in Invite" :key="member._id">{{ member.userName }}</li>
      <!-- <li v-for="member in allMembers" :key="member._id">member {{ member.userName }}</li> -->
    </ul>
  </div>
</template>

<script>
export default {
  name: "board-members",
  props: {
    // allMembers: Array,
    boardMembers: Array,
  },
  data() {
    return {
      showInvite: null,
    };
  },
  methods: {
    saveBoardBMember(idx) {
      this.$emit("saveBoardMember");
    },
    openUser() {
      console.log(member);
    },
    toggleShowInvite() {
      this.showInvite = !this.showInvite;
    },
  },
  computed: {
    Invite() {
      const toShow = this.allMembers.filter((member) => { 
          return (!this.boardMembers.find((boardMember) => {
              return (boardMember._id === member._id)
              }))
              });
        console.log(toShow);
        return toShow
    },
    allMembers() {
      console.log(this.$store.getters.users);
      return this.$store.getters.users;
    },
  },
};
</script>