<template>
	<div>
		<h3>CheckLists</h3>
		<form @submit.prevent="addCheckList">
			<input type="text" v-model="title">
			<button>Add</button>
		</form>
		<!-- {{title}} -->
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
		}
	}
}
</script>