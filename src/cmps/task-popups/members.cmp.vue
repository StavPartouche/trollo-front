<template>
  <div class="task-popup">
    <h3 class="task-popup-header">Members</h3>
    <button @click="closePopup" class="exit-popup-btn">X</button>
    <div class="task-members-popup flex-column">
      <input type="text" placeholder="Search member" v-model="filterBy" />
      <ul>
        <li
          @click="removeMember(idx)"
          v-for="(member, idx) in taskMembersToShow"
          :key="member._id"
          class="flex justify-space-between align-center"
        >
          <div class="flex align-center task-members-popup-member">
            <user-avatar :user="member"></user-avatar>
            <h4>{{ member.fullName }}</h4>
          </div>
          <i class="fas fa-check check"></i>
        </li>
      </ul>
      <ul>
        <li
          @click="addMember(member._id)"
          v-for="member in boardMembersToShow"
          :key="member._id"
          class="flex align-center task-members-popup-member"
        >
          <user-avatar :user="member"></user-avatar>
          <h4>{{ member.fullName }}</h4>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import userAvatar from "../user-avatar.cmp";

export default {
  name: "members",
  props: {
    boardMembers: Array,
    taskMembersIds: Array,
  },
  data() {
    return {
      filterBy: "",
    };
  },
  methods: {
    addMember(memberId) {
      console.log("member", memberId);
      this.$emit("taskUpdate", {
        type: "addMemberToTask",
        value: memberId,
      });
    },
    removeMember(memberIdx) {
      this.$emit("taskUpdate", {
        type: "removeMemberToTask",
        value: memberIdx,
      });
    },
    closePopup() {
      this.$emit("closePopup");
    },
  },
  computed: {
    boardMembersToShow() {
      var toShow = this.boardMembers.reduce((acc, member) => {
        if (!this.taskMembersIds.includes(member._id)) acc.push(member);
        return acc;
      }, []);
      if (this.filterBy === "") return toShow;
      return toShow.filter((member) => member.fullName.includes(this.filterBy));
    },
    taskMembersToShow() {
      var toShow = this.boardMembers.reduce((acc, member) => {
        if (this.taskMembersIds.includes(member._id)) acc.push(member);
        return acc;
      }, []);
      if (this.filterBy === "") return toShow;
      return toShow.filter((member) => member.fullName.includes(this.filterBy));
    },
  },
  components: {
    userAvatar,
  },
  created() {},
};
</script>