<template>
	<div id="app" class="flex-column app-container">
		<app-header />
		<router-view />
	</div>
</template>

<script>

import appHeader from '../src/cmps/app-header.cmp';

export default {
	name: 'app',
	components: {
		appHeader
	},
	created() {
		this.$store.dispatch({
			type: 'loadBoards',
		});
	}
}
</script>
