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
      isBgcColor: false,
      bgcImg: "",
      bgcColor: "",
    };
  },
  computed: {
    background() {
      console.log('computed');
      if (this.isBgcImg) {
        return {
          backgroundImage: `url(${require(`@/styles/assets/board-background-imgs/${this.bgcImg}`)})`,
        };
      }else if (this.isBgcColor){
        return{
          backgroundColor: `${this.bgcColor}`
        }
      }
      return "";
    },
  },
  components: {
    appHeader,
  },
  watch: {
    $route(to, from) {
      if (this.$route.name === "home-page") {
        this.isBgcImg = true;
        this.bgcImg = "home1.jpg";
      }
      if (this.$route.name === "login-page") {
        this.isBgcImg = true;
        this.bgcImg = "home1.jpg";
      }
    },
  },
  created() {
    this.$store.dispatch({
      type: "loadUsers",
    });
    if (this.$route.name === "home-page") {
      this.isBgcImg = true;
      this.bgcImg = "home1.jpg";
    }
    if (this.$route.name === "login-page") {
      this.isBgcImg = true;
      this.bgcImg = "home1.jpg";
    }
    eventBusService.$on("boardBgc", (bgc) => {
      console.log(bgc);
      if(!bgc.url){
        this.isBgcImg = false;
      }
      if (bgc.url==='color'){
        this.isBgcImg = false;
        this.isBgcColor = true;
        this.bgcColor = bgc.backgroundColor;
      } else{
        this.isBgcImg = true;
        this.isBgcColor = false;
        this.bgcImg = bgc.url;
        
      }

      // if (bgc.type==='img'){
      //   this.isBgcImg = true;
      //   this.bgcImg = bgc.img;
      // } else if (bgc.type==='color'){
      //   this.isBgcColor = true;
      //   this.bgcColor = bgc.color;
      // }else{
      //   this.isBgcImg = false;
      // }
      // if (!bgc) this.isBgcImg = false;
      // this.isBgcImg = false;
      // else {
      //   this.isBgcImg = true;
      //   this.bgcImg = bgc;
      // }
    });
  },
};
</script>
