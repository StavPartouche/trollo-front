<template>
	<div class="task-popup">
		<h3 class="task-popup-header">CheckLists</h3>
		<button @click="closePopup" class="exit-popup-btn">X</button>
		<add-item-input class="task-checklist-popup" @add="addCheckList" />
	</div>
</template>

<script>
import addItemInput from '../add-item-input.cmp';

export default {
	name: 'checkList',
	data() {
		return {
		}
	},
	methods: {
		addCheckList(value){
			this.$emit('addCheckList', value)
		},
		closePopup(){
			this.$emit("closePopup")
		}
	},
	components: {
		addItemInput
	}
}
</script>