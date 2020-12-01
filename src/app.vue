<template>
  <div
    id="app"
    class="flex-column app-container background-image"
    :style="background"
  >
    <!-- <div
      @click="closeDisable"
      v-if="disablePage.isDisable"
      class="disable-page-container"
      :style="{ 'z-index': disablePage.zIndex }"
    ></div> -->
    <app-header />
    <router-view />
  </div>
</template>

<script>
import appHeader from "../src/cmps/app-header.cmp";
import { eventBusService } from "./services/eventBus.service";
import socket from "@/services/socket.service";
import io from "socket.io-client";

export default {
  name: "app",
  data() {
    return {
      isBgcImg: false,
      isBgcColor: false,
      bgcImg: "",
      bgcColor: "",
      // disablePage: {
      //   isDisable: false,
      //   zIndex: 1,
      //   to: null
      // },
    };
  },
  // methods: {
  //   closeDisable() {
  //     this.disablePage.isDisable = false;
  //     eventBusService.$emit(`disablePage-${this.disablePage.to}`)
  //     console.log('closeDisable');
  //   },
  // },
  computed: {
    background() {
      if (this.isBgcImg) {
        return {
          backgroundImage: `url(${require(`@/styles/assets/board-background-imgs/${this.bgcImg}`)})`,
        };
      } else if (this.isBgcColor) {
        return {
          backgroundColor: `${this.bgcColor}`,
        };
      }
      return "";
    },
    loggedInUser() {
      return this.$store.getters.loggedInUser;
    },
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
    const user = this.loggedInUser || { userName: "guest" };
    socket.setup(user);
    socket.emit("user connect", user);
    this.$store.dispatch({
      type: "loadUsers",
    });
    if (this.$route.name === "home-page" || this.$route.name === "login-page") {
      this.isBgcImg = true;
      this.bgcImg = "home1.jpg";
    }
    // if (this.$route.name === "login-page") {
    //   this.isBgcImg = true;
    //   this.bgcImg = "home1.jpg";
    // }
    eventBusService.$on("boardBgc", (bgc) => {
      if (!bgc.url) {
        this.isBgcImg = false;
        this.isBgcColor = false;
      }
      if (bgc.url === "color") {
        this.isBgcImg = false;
        this.isBgcColor = true;
        this.bgcColor = bgc.backgroundColor;
      } else {
        this.isBgcImg = true;
        this.isBgcColor = false;
        this.bgcImg = bgc.url;
      }
    });
    // eventBusService.$on("disablePage", (info) => {
    //   this.disablePage.zIndex = info.zIndex ? info.zIndex : 1;
    //   this.disablePage.isDisable = true;
    //   this.disablePage.to = info.to
    // });
  },
  destroyed() {
    eventBusService.$off("boardBgc");
    socket.terminate();
  },
  components: {
    appHeader,
  },
};
</script>
