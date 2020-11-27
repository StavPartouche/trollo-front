<template>
	<div class="task-popup">
		<h3 class="task-popup-header">Members</h3>
		<button @click="closePopup" class="exit-popup-btn">X</button>
		<div class="task-members-popup">
            <input type="text" placeholder="Serch member" v-model="filterBy">
            <ul>
                <li @click="removeMember(idx)" v-for="(member, idx) in taskMembersToShow" :key="member._id">
                    <img  class="avatar" :src="member.imgUrl"/> {{member.fullName}} V
                </li>
            </ul>
            <ul>
                <li @click="addMember(member._id)" v-for="member in boardMembersToShow" :key="member._id">
                    <img  class="avatar" :src="member.imgUrl"/> {{member.fullName}}
                </li>
            </ul>
        </div>
	</div>
</template>

<script>

export default {
    name: 'members',
    props:{
        boardMembers: Array,
        taskMembersIds: Array,
    },
	data() {
		return {
            filterBy: ''
		}
	},
	methods: {
        addMember(memberId){
            this.$emit("taskUpdate", {
				type: "addMemberToTask",
				value: memberId
			})
        },
        removeMember(memberIdx){
            this.$emit("taskUpdate", {
				type: "removeMemberToTask",
				value: memberIdx
			})
        },
		closePopup(){
			this.$emit("closePopup")
		}
    },
    computed:{
        boardMembersToShow(){
            var toShow = this.boardMembers.reduce((acc, member) => {
                if (!this.taskMembersIds.includes(member._id)) acc.push(member);
                return acc;
            },[])
            if(this.filterBy === '') return toShow
            return toShow.filter(member => member.fullName.includes(this.filterBy))
        },
        taskMembersToShow(){
            var toShow = this.boardMembers.reduce((acc, member) => {
                if (this.taskMembersIds.includes(member._id)) acc.push(member);
                return acc;
            },[])
            if(this.filterBy === '') return toShow
            return toShow.filter(member => member.fullName.includes(this.filterBy))
        }
    },
    created(){

    }
}
</script>