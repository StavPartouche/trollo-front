<template>
  <nav class="app-header flex align-center justify-space-between"  :class="{ 'app-header-home-page': home.isHome, 'scrolled': home.isScrolled }">
    <div class="widht-200 app-header-left flex align-center justify-start">
      <router-link class="app-header-home" to="/">
        <font-awesome-icon class="icon home-icon" :icon="['fas', 'home']" />
        <!-- Home -->
      </router-link>
      <router-link class="app-header-board" to="/board" title="boards">
        <font-awesome-icon
          class="icon board-icon"
          :icon="['fas', 'th-large']"
        />
        <!-- Boards -->
      </router-link>
    </div>
    <router-link to="/" class="logo"><span>T</span>rollo</router-link>
    <div class="widht-200 flex justify-end align-center">
      <router-link to="/login" v-if="!loggedInUser">Login</router-link>
      <div @mouseover="openMenu" @mouseleave="closeMenu">
        <user-avatar
          class="pointer nav-avatar"
          v-if="loggedInUser"
          :user="loggedInUser"
          :width="33"
        ></user-avatar>
        <div v-if="isMenu" class="user-menu">
          <!-- <h3>Menu</h3> -->
          <button @click="onLogout">Logout</button>
        </div>
      </div>
    </div>
    <!-- <router-link v-if="home.isHome && !home.isScrolled" to="/" class="logo logo-to-home"><span>T</span>rollo</router-link> -->
  </nav>
  <!-- <nav class="app-header flex align-center justify-space-between">
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
	</nav> -->
</template>

<script>
import userAvatar from "./user-avatar.cmp";

export default {
  name: "app-header",
  data() {
    return {
      isMenu: false,
            home: {
        isHome: false,
        isScrolled: false,
      },
    };
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedInUser;
    },
  },
  methods: {
    onLogout() {
      this.closeMenu();
      this.$store.dispatch({ type: "logout" });
      if (this.$router.currentRoute.path !== "/") this.$router.push("/");
    },
    openMenu() {
      this.isMenu = true;
    },
    closeMenu() {
      this.isMenu = false;
    },
        onScroll(e) {
          this.home.isScrolled = document.querySelector(".home-page").scrollTop > 190
          if (this.home.isScrolled){
            document.querySelector(".home-page .logo").style.opacity=0;
          }else{
            document.querySelector(".home-page .logo").style.opacity=1;
          }
    //  console.log(document.querySelector(".home-page").scrollTop)

    },
  },
   watch: {
    $route(to, from) {
      if (this.$route.name === "home-page") {
        this.home.isHome = true;
        this.home.isScrolled = false;
                  document
      .querySelector(".home-page")
      .addEventListener("scroll", this.onScroll)
      }else if(this.$route.name === "board-list") {
        this.home.isHome = true;
        this.home.isScrolled = true;
      } else {
        this.home.isHome = false;
      }
      //          document
      // .querySelector(".home-page")
      // .removeEventListener("scroll", this.onScroll);
      }
    },
  created(){
      if (this.$route.name === "home-page") {
        this.home.isHome = true;
        this.home.isScrolled = false;
      } else if(this.$route.name === "board-list") {
        this.home.isHome = true;
        this.home.isScrolled = true;
      }else {
        this.home.isHome = false;
      }   
  },
  mounted() {
     if (this.$route.name === "home-page"){
       document
      .querySelector(".home-page")
      .addEventListener("scroll", this.onScroll);
     }
  },
  beforeDestroy() {
    document
      .querySelector(".home-page")
      .removeEventListener("scroll", this.onScroll);
  },
    // toggleMenu(){
    // 	this.isMenu = !this.isMenu
    // },
    // toUserPage() {
    //   this.closeMenu();
    //   this.$router.push("/user");
    // },
  components: {
    userAvatar,
  },
};
</script>