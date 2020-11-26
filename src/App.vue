<template>
  <div
    id="app"
    class="flex-column app-container background-image"
    :style="background"
  >
    <app-header />
    <router-view />
  </div>
</template>

<script>
import appHeader from "../src/cmps/app-header.cmp";
import { eventBusService } from "./services/eventBus.service";

export default {
  name: "app",
  data() {
    return {
      isBgcImg: false,
      bgcImg: "",
    };
  },
  computed: {
    background() {
      if (this.isBgcImg) {
        return {
          // backgroundImage: `url(${require(`@/styles/assets/board-background-imgs/${this.bgcImg}`)})`
          backgroundImage: `url(${require(`@/styles/assets/board-background-imgs/${this.bgcImg}`)})`
        }
      }
      return '';
    },
    // backgroundImage() {
    // return this.bgcImg;
    // },
  },
  components: {
    appHeader,
  },
  watch: {
    $route(to, from) {
      if (this.$route.name === "home-page") {
        this.isBgcImg = true;
        this.bgcImg = "home1.jpg";
        // this.isHome = true;
        //   } else {
        // this.isHome = false;
      }
    },
  },
  created() {
    if (this.$route.name === "home-page") {
      this.isBgcImg = true;
      // this.isBgcImg = true;
      this.bgcImg = "home1.jpg";
      //   this.isHome = true;
      // } else {
      //   this.isHome = false;
    }
    eventBusService.$on("boardBgc", (bgc) => {
      if (!bgc) this.isBgcImg = false;
      else {
        this.isBgcImg = true;
        this.bgcImg = bgc;
      }
    });
  },
};
</script>
