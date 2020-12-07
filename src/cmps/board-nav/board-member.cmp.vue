<template>
  <div class="board-member flex center">
    <div
    v-if="showInvite"
      @click="closeShowInvite"
      class="disable-page-container"
    ></div>
          <user-avatar class="user-avatar-nav" v-for="member in boardMembers"
        :key="member._id"
        @removeBoardMember="removeBoardMember"
        :user="member"></user-avatar>
        <button
          class="btn-add-board-user flex center"
          v-if="allMembers"
          @click="openShowInvite"
        > 
        <p class="plus-icon">+</p>
                <font-awesome-icon
          class="board-nav-icon user-icon"
          :icon="['fas', 'user']"
        />
        </button>
    <div class="invite" v-if="showInvite">
      <member-list :selectedMembers="boardMembers"
    :allMembers="membersToInvite" @addMember="addBoardBMember" @removeMember="removeBoardMember"></member-list>
    </div>
  </div>
</template>

<script>
import userAvatar from "../user-avatar.cmp";
import memberList from "../member-list.cmp";

export default {
  name: "board-members",
  props: {
    boardMembers: Array,
  },
  data() {
    return {
      showInvite: null,
      filterBy: "",
    };
  },
  methods: {
    addBoardBMember(memberId) {
      this.$emit("addBoardMember", memberId);
    },
    removeBoardMember(memberId) {
      this.$emit("removeBoardMember", memberId);
    },
    openUser() {
        this.showUser= !this.showUser
    },
    openShowInvite() {
      this.showInvite = true;
    },
    closeShowInvite() {
      this.showInvite = false;
    },
    onKeyUp(ev) {
      if (ev.keyCode === 27 && this.showInvite) this.closeShowInvite();
    },
  },
  computed: {
    membersToInvite() {
      const toInvite = this.allMembers.filter((member) => {
        return !this.boardMembers.find((boardMember) => {
          return boardMember._id === member._id;
        });
      });
      if (!toInvite.length) return [];
      return toInvite.filter((member) => {
        return member.fullName.includes(this.filterBy);
      });
    },
    allMembers() {
      return this.$store.getters.users;
    },
  },
  created() {
    document.body.addEventListener("keyup", this.onKeyUp);
  },
  destroyed() {
    document.body.removeEventListener("keyup", this.onKeyUp);
  },
  components: {
    userAvatar,
    memberList
  },
};
</script>