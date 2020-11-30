<template>
  <div class="board-member">
    <div @click="toggleShowInvite" :class="{'disable-page-container': showInvite}"></div>
    <ul class="flex center">
      <board-member-card
        v-for="member in boardMembers"
        :key="member._id"
        @removeBoardMember="removeBoardMember"
        :member="member"
      ></board-member-card>
      <li>
        <button
          class="btn-add-board-user"
          v-if="allMembers"
          @click="toggleShowInvite"
        >
          <i class="fas fa-user-plus"></i>
        </button>
      </li>
    </ul>
    <div class="invite" v-if="showInvite">
      <p  v-if="!membersToInvite" >No users to show</p>
      <input v-else  type="text" placeholder="Search member" v-model="filterBy" />
      <ul>
        <li
          class="userToShow flex align-center"
          @click="addBoardBMember(member._id)"
          v-for="member in membersToInvite"
          :key="member._id"
        >
        <user-avatar :user="member"></user-avatar>
          <p>{{ member.userName }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import boardMemberCard from "./board-member-card.cmp";
import userAvatar from '../user-avatar.cmp'

export default {
  name: "board-members",
  props: {
    // allMembers: Array,
    boardMembers: Array,
  },
  data() {
    return {
      showInvite: null,
      filterBy: "",
      //   showUser:false
    };
  },
  methods: {
    addBoardBMember(memberId) {
      this.$emit("addBoardMember", memberId);
    },
    removeBoardMember(memberId) {
      this.$emit("removeBoardMember", memberId);
    },
    // openUser() {
    //     this.showUser= !this.showUser
    // },
    toggleShowInvite() {
      this.showInvite = !this.showInvite;
    },
    onKeyUp(ev) {
      if (ev.keyCode === 27 && this.showInvite) this.toggleShowInvite();
    }
  },
  computed: {
    membersToInvite() {
      const toInvite = this.allMembers.filter((member) => {
        return !this.boardMembers.find((boardMember) => {
          return boardMember._id === member._id;
        });
      });
      if (!toInvite.length) return;
      return toInvite.filter((member) => {
        return member.userName.includes(this.filterBy);
      });
    },
    allMembers() {
      return this.$store.getters.users;
    },
  },
  created() {
    document.body.addEventListener('keyup', this.onKeyUp)
  },
  destroyed() {
    document.body.removeEventListener('keyup', this.onKeyUp)
  },
  components: {
    boardMemberCard,
    userAvatar
  },
};
</script>