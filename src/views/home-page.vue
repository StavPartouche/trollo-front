<template>
  <section class="home-page">
    <!-- <img class="header-bgc" src="@/styles/assets/headerBgc.jpg" /> -->
    <div class="hero background-image flex-column center">
      <h1 class="logo"><span>T</span>rollo</h1>
      <!-- <div style="height:130px"></div> -->
      <h2 class="flex centetr">Management, the way you want it.</h2>
      <button class="try-now-btn" @click="goToBoards">Try it now</button>
    </div>
    <div class="explain real-time-explain flex align-center justify start">
      <img
        src="@/styles/assets/home-page-explain/communication2.svg"
        alt="no Img"
      />
      <div class="text">
        <h3>Real time comunication and updates</h3>
        <p>
          enjoy a workplace that syncs in real time, allowing you to see the
          current state of every piece of work
        </p>
      </div>
    </div>
    <div class="explain accesible-explain flex align-center justify start">
      <div class="text">
        <h3>Extremely accessible and easy to use</h3>
        <p>
          our system is super easy to understand and apply, now you can just
          focus on your project
        </p>
      </div>
      <img src="@/styles/assets/home-page-explain/accesible.svg" alt="no Img" />
    </div>
    <div class="explain on-track-explain flex align-center justify start">
      <img src="@/styles/assets/home-page-explain/track.svg" alt="no Img" />
      <div class="text">
        <h3>stay on track</h3>
        <p>
          all of your projects data will be accessible within one click on the
          dashboard button
        </p>
      </div>
    </div>

    <!-- <div class="explain collaboration-explain flex align-center justify start">
      <img
        src="@/styles/assets/home-page-explain/undraw_real_time_collaboration_c62i.svg"
        alt="no Img"
      />
      <p class="text">Add somethin about collaboration</p>
    </div> -->
    <!-- <button class="try-now-btn" @click="goToBoards"><img src="@/styles/assets/tryNow.png" /></button> -->
    <!-- <footer class="flex center">
			<p><span>®</span> All rights reserved 2020 - Stav Partouche - Maya Malik - Inbar Tamir</p>
		</footer> -->
  </section>
</template>

<script>
import { eventBusService } from "../services/eventBus.service";
import appHeader from "../cmps/app-header.cmp";

export default {
  name: "home-page",
  methods: {
    goToBoards() {
      this.$router.push("/board");
    },
  },

};
</script>
