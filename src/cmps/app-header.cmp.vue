<template>
	<nav class="app-header flex align-center justify-space-between">
		<router-link to="/" class="logo"><span>T</span>rollo</router-link>
		<div class="links flex align-center">
			<router-link to="/board">Boards</router-link> 
			<router-link to="/login" v-if="!loggedInUser">Login</router-link>
			<user-avatar class="pointer nav-avatar" v-if="loggedInUser" @click.native="toggleMenu" :user="loggedInUser"></user-avatar>
		</div>
		<div v-if="isMenu" class="user-menu">
			<h3>Menu</h3>
			<button @click="toUserPage">User Page</button>
			<button @click="onLogout">Logout</button>
		</div>
	</nav>
</template>

<script>

import userAvatar from './user-avatar.cmp'

export default {
	name: 'app-header',
	data() {
		return {
			isMenu: false
		}
	},
	computed: {
		loggedInUser() {
			return this.$store.getters.loggedInUser;
		}
	},
	methods: {
		onLogout() {
			this.toggleMenu()
			this.$store.dispatch({type: 'logout'})
			if (this.$router.currentRoute.path !== '/') this.$router.push('/');
		},
		toggleMenu(){
			this.isMenu = !this.isMenu
		},
		toUserPage(){
			this.toggleMenu()
			this.$router.push('/user')
		}
	},
	components:{
		userAvatar
	}
}
</script>