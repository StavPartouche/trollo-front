<template>
	<section class="home-page flex-column center">
		<h1>something we want to tell about the purpase of this amazing app</h1>
		<button @click="goToBoards">Try it now</button>
		<footer>
			<p>® All rights reserved 2020 - Stav Partouche - Maya Malik - Inbar Tamir</p>
		</footer>
	</section>
</template>

<script>

export default {
	name: 'home-page',
	methods:{
		goToBoards(){
			this.$router.push('/board')
		}
	}
}
</script>
