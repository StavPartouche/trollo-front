<template>
	<form @submit.prevent="emitAddItem">
		<input
			ref="input"
			type="text"
			placeholder="Enter Title"
			v-model="itemTxt"
		/>
		<button>Add</button>
	</form>
</template>

<script>
export default {
	name: 'addItemInput',
	data() {
		return {
			itemTxt: ''
		};
	},
	methods: {
		emitAddItem() {
			this.$emit('add', this.itemTxt);
		}
    },
    mounted() {
        this.$refs.input.focus();
    }
}
</script>