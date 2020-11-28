<template>
	<div class="task-popup">
		<h3 class="task-popup-header">CheckLists</h3>
		<button @click="closePopup" class="exit-popup-btn">X</button>
		<!-- <form class="task-checklist-popup" @submit.prevent="addCheckList">
			<input type="text" v-model="title">
			<button>Add</button>
		</form> -->
		<add-item-input class="task-checklist-popup" @add="addCheckList" />
	</div>
</template>

<script>
import addItemInput from '../add-item-input.cmp';

export default {
	name: 'checkList',
	data() {
		return {
			// title:''
		}
	},
	methods: {
		addCheckList(value){
			this.$emit("taskUpdate", {
				type: "checkList",
				// value: this.title
				value
			})
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