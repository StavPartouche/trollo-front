<template>
	<div class="task-popup">
		<h3 class="task-popup-header">Members</h3>
		<button @click="closePopup" class="exit-popup-btn">
			<font-awesome-icon :icon="['fas', 'times']" />
		</button>
		<member-list
			:width="230"
			:selectedMembers="taskMembersToShow"
			:allMembers="boardMembersToShow"
			@addMember="addMember"
			@removeMember="removeMember"
		></member-list>
		<!-- <div class="task-members-popup flex-column">
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
    </div> -->
	</div>
</template>

<script>
import userAvatar from "../user-avatar.cmp";
import memberList from "../member-list.cmp";


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
			this.$emit("addMemberToTask", memberId);
		},
		removeMember(memberId) {
			this.$emit("removeMemberfromTask", memberId);
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
			return toShow;
		},
		taskMembersToShow() {
			var toShow = this.boardMembers.reduce((acc, member) => {
				if (this.taskMembersIds.includes(member._id)) acc.push(member);
				return acc;
			}, []);
			return toShow;
		},
	},
	components: {
		userAvatar,
		memberList
	},
	created() { },
};
</script>