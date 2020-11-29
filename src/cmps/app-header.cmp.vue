<template>
	<nav class="app-header flex align-center justify-space-between">
		<!-- <router-link to="/" class="logo"><img src="@/styles/assets/logo.png"/>Trollo</router-link> -->
		<router-link to="/" class="logo"><span>T</span>rollo</router-link>
		<div class="links flex align-center">
			<router-link to="/board">Boards</router-link> |
			<router-link to="/login" v-if="!loggedInUser">Login</router-link>
			<template v-if="loggedInUser">
				<router-link to="/user">User Page</router-link> |
				<a href="#" @click="onLogout">Logout</a>
			</template>
		</div>
	</nav>
</template>

<script>

export default {
	name: 'app-header',
	data() {
		return {
			// loggedInUser: null
		}
	},
	computed: {
		loggedInUser() {
			return this.$store.getters.loggedInUser;
		}
	},
	methods: {
		onLogout() {
			this.$store.dispatch({type: 'logout'})
			if (this.$router.currentRoute.path !== '/') this.$router.push('/');
		}
	}
}
</script>