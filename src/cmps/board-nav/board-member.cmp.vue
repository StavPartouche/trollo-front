<template>
  <div class="board-member flex">
    <ul class="flex center">
      <board-member-card
        v-for="member in boardMembers"
        :key="member._id"
        @removeBoardMember="removeBoardMember"
        :member="member"
      ></board-member-card>
    </ul>
    <button v-if="allMembers" @click="toggleShowInvite"><i class="el-icon-plus"></i></button>
    <div class="invite" v-if="showInvite">
      <input type="text" placeholder="Search member" v-model="filterBy" />
      <ul>
        <li
          class="userToShow"
          @click="addBoardBMember(member._id)"
          v-for="member in membersToInvite"
          :key="member._id"
        >
          {{ member.userName }}
        </li>
        <!-- <li v-for="member in allMembers" :key="member._id">member {{ member.userName }}</li> -->
      </ul>
    </div>
  </div>
</template>

<script>
import boardMemberCard from "./board-member-card.cmp";
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
    // //   console.log(member);
    // },
    toggleShowInvite() {
      this.showInvite = !this.showInvite;
    },
  },
  computed: {
    membersToInvite() {
      const toInvite = this.allMembers.filter((member) => {
        return !this.boardMembers.find((boardMember) => {
          return boardMember._id === member._id;
        });
      });
      return toInvite.filter((member) => {
        return (
          member.userName.includes(this.filterBy)
          //  ||
          // member.fullName.includes(this.filterBy)
        );
      });
    },
    allMembers() {
      return this.$store.getters.users;
    },
  },
  components: {
    boardMemberCard,
  },
};
</script>