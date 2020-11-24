<template>
	<nav class="app-header flex align-center justify-space-between">
		<router-link to="/" class="logo"
			><img src="@/styles/assets/logo.png"
		/></router-link>
		<div class="links flex align-center">
			<router-link to="/board">Boards</router-link> |
			<router-link to="/login" v-if="!loggedInUser">Login</router-link>
			<template v-if="loggedInUser">
				<router-link to="/user">User Page</router-link> |
				<router-link to="/logout">Logout</router-link>
			</template>
		</div>
	</nav>
</template>

<script>

export default {
	name: 'app-header',
	data() {
		return {
			loggedInUser: null
		}
	}
}
</script>