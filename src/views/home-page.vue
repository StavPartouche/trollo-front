<template>
	<section class="home-page ">
		<img class="header-bgc" src="@/styles/assets/headerBgc.jpg" />
		<div class="hero background-image flex-column center" >
		<h1 class="logo"><span>T</span>rollo</h1>
		<h2 class="flex centetr">something we want to tell about the purpase of this amazing app</h2>
		<button class="try-now-btn" @click="goToBoards">Try it now</button>
		</div>
		<div class="explain collaboration-explain flex align-center justify start">
<img src="@/styles/assets/home-page-explain/undraw_real_time_collaboration_c62i.svg" alt="no Img">
<p class="text">Add somethin about collaboration</p>
		</div>
		<!-- <button class="try-now-btn" @click="goToBoards"><img src="@/styles/assets/tryNow.png" /></button> -->
		<!-- <footer class="flex center">
			<p><span>®</span> All rights reserved 2020 - Stav Partouche - Maya Malik - Inbar Tamir</p>
		</footer> -->
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
