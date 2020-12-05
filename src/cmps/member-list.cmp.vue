<template>
  <div class="member-list flex-column" :style="{width: `${width}px`}">
      <input type="text" placeholder="Search member" v-model="filterBy" />
      <div class="y-auto">
      <ul>
        <li
          @click="removeMember(member._id)"
          v-for="(member) in selectedMembersToShow"
          :key="member._id"
          class="flex justify-space-between align-center"
        >
          <div class="flex align-center member-list-name">
            <user-avatar :user="member"></user-avatar>
            <p>{{ member.fullName }}</p>
          </div>
        <font-awesome-icon :icon="['fas', 'check']" />
        </li>
      </ul>
      <ul>
        <li
          @click="addMember(member._id)"
          v-for="member in allMembersToShow"
          :key="member._id"
          class="flex align-center member-list-name"
        >
          <user-avatar :user="member"></user-avatar>
          <p>{{ member.fullName }}</p>
        </li>
      </ul>
      </div>
    </div>
</template>

<script>
import userAvatar from "./user-avatar.cmp";

export default {
  name: "members",
  props: {
    selectedMembers: Array,
    allMembers: Array,
        width: {
        type: Number,
        default: 230
  },
  },
  data() {
    return {
      filterBy: "",
    };
  },
  methods: {
    addMember(memberId) {
      this.$emit("addMember", memberId);
    },
    removeMember(memberId) {
      this.$emit("removeMember", memberId);
    },
  },
  computed: {
      selectedMembersToShow(){
          return this.selectedMembers.filter((member) => {
        return member.userName.includes(this.filterBy);
      })
      },
      allMembersToShow(){
          return this.allMembers.filter((member) => {
        return member.userName.includes(this.filterBy);
      })
      }
  },
  components: {
    userAvatar,
  },
  created() {
  },
};
</script>