<template>
	<nav class="app-header flex align-center justify-space-between">
		<!-- <router-link to="/" class="logo"><img src="@/styles/assets/logo.png"/>Trollo</router-link> -->
		<router-link to="/" class="logo">Trollo</router-link>
		<div class="links flex align-center">
			<router-link to="/board">Boards</router-link> |
			<router-link to="/login" v-if="!loggedInUser">Login</router-link>
			<template v-if="loggedInUser">
				<router-link to="/user">User Page</router-link> |
				<!-- <router-link to="/logout">Logout</router-link> -->
				<a @click="onLogout">Logout</a>
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
			console.log('this.$store.getters.loggedInUser:', this.$store.getters.loggedInUser)
			return this.$store.getters.loggedInUser;
		}
	},
	methods: {
		onLogout() {
			// this.$store.
		}
	}
}
</script>