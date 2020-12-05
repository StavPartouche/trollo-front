<template>
  <div class="board-member flex center">
    <div
    v-if="showInvite"
      @click="closeShowInvite"
      class="disable-page-container"
    ></div>
    <!-- <ul class="flex center"> -->
          <user-avatar class="user-avatar-nav" v-for="member in boardMembers"
        :key="member._id"
        @removeBoardMember="removeBoardMember"
        :user="member"></user-avatar>

      <!-- <board-member-card
        v-for="member in boardMembers"
        :key="member._id"
        @removeBoardMember="removeBoardMember"
        :member="member"
      ></board-member-card> -->
      <!-- <li> -->
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
          <!-- <font-awesome-icon :icon="['fas', 'plus']" /> -->
        </button>
      <!-- </li> -->
    <!-- </ul> -->
    <div class="invite" v-if="showInvite">
      <!-- <p v-if="!membersToInvite">No users to show</p> -->
      <!-- <input
        v-else
        type="text"
        placeholder="Search member"
        v-model="filterBy"
      /> -->
      <member-list :selectedMembers="boardMembers"
    :allMembers="membersToInvite" @addMember="addBoardBMember" @removeMember="removeBoardMember"></member-list>
      <!-- <ul>
        <li
          class="userToShow flex align-center"
          @click="addBoardBMember(member._id)"
          v-for="member in membersToInvite"
          :key="member._id"
        >
          <user-avatar :user="member"></user-avatar>
          <p>{{ member.fullName }}</p>
        </li>
      </ul> -->
    </div>
  </div>
</template>

<script>
import boardMemberCard from "./board-member-card.cmp";
import userAvatar from "../user-avatar.cmp";
import memberList from "../member-list.cmp";

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
    boardMemberCard,
    userAvatar,
    memberList
  },
};
</script>