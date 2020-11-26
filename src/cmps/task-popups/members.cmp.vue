<template>
	<div class="task-popup">
		<h3 class="task-popup-header">Members</h3>
		<button @click="closePopup" class="exit-popup-btn">X</button>
		<div class="task-members-popup">
            <input type="text" placeholder="Serch member" v-model="filterBy">
            <ul>
                <li @click="addMember(member._id)" v-for="member in membersToShow" :key="member._id">
                    {{member.fullName}}
                </li>
            </ul>
        </div>
	</div>
</template>

<script>

export default {
    name: 'members',
    props:{
        members: Array
    },
	data() {
		return {
            filterBy: ''
		}
	},
	methods: {
		addCheckList(){
			this.$emit("taskUpdate", {
				type: "checkList",
				value: this.title
			})
        },
        addMember(memberId){
            this.$emit("taskUpdate", {
				type: "members",
				value: memberId
			})
        },
		closePopup(){
			this.$emit("closePopup")
		}
    },
    computed:{
        membersToShow(){
            if(this.filterBy === '') return this.members
            return this.members.filter(member => member.fullName.includes(this.filterBy))
        }
    },
    created(){
        console.log(this.members);
    }
}
</script>