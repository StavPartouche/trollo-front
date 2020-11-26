<template>
	<div class="task-popup">
		<h3 class="task-popup-header">CheckLists</h3>
		<button @click="closePopup" class="exit-popup-btn">X</button>
		<form class="task-checklist-popup" @submit.prevent="addCheckList">
			<input type="text" v-model="title">
			<button>Add</button>
		</form>
	</div>
</template>

<script>

export default {
	name: 'checkList',
	data() {
		return {
			title:''
		}
	},
	methods: {
		addCheckList(){
			this.$emit("taskUpdate", {
				type: "checkList",
				value: this.title
			})
		},
		closePopup(){
			this.$emit("closePopup")
		}
	}
}
</script>