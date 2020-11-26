<template>
	<div class="task-popup">
		<h3 class="task-popup-header">dueDate</h3>
		<button @click="closePopup" class="exit-popup-btn">X</button>
	</div>
</template>

<script>

export default {
	name: 'dueDate',
	data() {
		return {
			
		}
	},
	methods: {
		closePopup(){
			this.$emit("closePopup")
		}
	}
}
</script>