<template>
  <section class="login-page flex center">
    <template v-show="!loggedinUser">
      <form
        @submit.prevent="doLogin"
        v-if="isLogin"
        class="flex-column align-center"
      >
        <input
          type="text"
          v-model="loginCred.userName"
          placeholder="Username"
        />
        <br />
        <label class="password" for="">
          <input
            :type="passwordType"
            v-model="loginCred.password"
            placeholder="Password"
          />
          <font-awesome-icon class="password-btn" :icon="['fas', 'eye']" />
        </label>
        <!-- <button
					ref="passwordBtn"
					type="button"
					class="password-btn"
					@click="togglePassword"
				>
					<i class="far fa-eye"></i>
				</button> -->
        <br />
        <p class="login-err-msg" v-if="msg">{{ msg }}</p>
        <button>Login</button>
        <h5 class="login-signup-txt">
          Not a user? <a href="#" @click="toggleLogin">Sign Up</a>
        </h5>
      </form>

      <form @submit.prevent="doSignup" v-else v-show="!isLoading">
        <input
          type="text"
          v-model="signupCred.userName"
          placeholder="Username"
        />
        <br />
        <input
          type="text"
          v-model="signupCred.fullName"
          placeholder="FullName"
        />
        <br />
        <label class="password" for="">
          <input
            :type="passwordType"
            v-model="signupCred.password"
            placeholder="Password"
          />
          <font-awesome-icon class="password-btn" :icon="['fas', 'eye']" />
        </label>
        <!-- <button
					ref="passwordBtn"
					type="button"
					class="password-btn"
					@click="togglePassword"
				>
					<i class="far fa-eye"></i>
				</button> -->
        <br />
        <!-- <input
					type="text"
					v-model="signupCred.password"
					placeholder="Password"
				/>
				<br /> -->
        <label>
          Image:
          <input type="file" @change="onUploadImg" />
        </label>
        <user-avatar
          v-if="signupCred.imgUrl"
          :width="80"
          :user="{ imgUrl: signupCred.imgUrl }"
        ></user-avatar>
        <br />
        <p class="login-err-msg" v-if="msg">{{ msg }}</p>
        <button>Signup</button>
        <h5 class="login-signup-txt">
          Already a user? <a href="#" @click="toggleLogin">Login</a>
        </h5>
      </form>
      <img v-if="isLoading" src="@/styles/assets/loading.gif" />
    </template>
    <!-- <hr /> -->
  </section>
</template>

<script>
import { uploadImg } from "@/services/img-upload.service.js";
import userAvatar from "../cmps/user-avatar.cmp";

export default {
  name: "login-page",
  data() {
    return {
      loginCred: {},
      signupCred: {},
      msg: "",
      userToEdit: {},
      isLoading: false,
      isLogin: true,
      passwordType: "password",
    };
  },
  computed: {
    users() {
      return this.$store.getters.users;
    },
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    },
  },
  created() {},
  methods: {
    async doLogin() {
      const cred = this.loginCred;
      if (!cred.userName || !cred.password)
        return (this.msg = "Please enter userName/password");
      const user = await this.$store.dispatch({
        type: "login",
        userCred: cred,
      });
      if (user) {
        this.loginCred = {};
        this.$router.push("/board");
      } else this.msg = "Invalid userName/password";
    },
    doSignup() {
      const cred = this.signupCred;
      if (!cred.imgUrl) cred.imgUrl = "";
      if (!cred.userName || !cred.fullName || !cred.password)
        return (this.msg = "Please fill up all the fields ");
      this.$store.dispatch({ type: "signup", userCred: cred });
      this.signupCred = {};
      this.$router.push("/board");
    },
    getAllUsers() {
      this.$store.dispatch({ type: "loadUsers" });
    },
    removeUser(userId) {
      this.$store.dispatch({ type: "removeUser", userId });
    },
    updateUser() {
      this.$store.dispatch({ type: "updateUser", user: this.userToEdit });
    },
    async onUploadImg(ev) {
      this.isLoading = true;
      const res = await uploadImg(ev);
      this.signupCred.imgUrl = res.url;
      this.isLoading = false;
    },
    toggleLogin() {
      this.msg = "";
      this.isLogin = !this.isLogin;
    },
    togglePassword() {
      this.passwordType =
        this.passwordType === "password" ? "text" : "password";
      const passwordClass =
        this.passwordType === "password" ? "fa-eye" : "fa-eye-slash";
      this.$refs.passwordBtn.innerHTML = `<i  class="far ${passwordClass}"></i>`;
    },
  },
  watch: {
    loggedinUser() {
      this.userToEdit = { ...this.loggedinUser };
    },
  },
  components: {
    userAvatar,
  },
  created() {
  },
};
</script>