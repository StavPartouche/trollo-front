<template>
	<div class="task-popup">
		<h3 class="task-popup-header">Checklists</h3>
		<button @click="closePopup" class="exit-popup-btn"><font-awesome-icon :icon="['fas', 'times']" /></button>
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