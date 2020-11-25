<template>
	<section class="login-page flex-column align-center">
		<div v-if="loggedinUser">
			<h3>
				Loggedin User:
				{{ loggedinUser.username }}
				<button @click="doLogout">Logout</button>
			</h3>
		</div>
		<div v-else>
			<form @submit.prevent="doLogin" v-if="isLogin">
				<input
					type="text"
					v-model="loginCred.userName"
					placeholder="Username"
				/>
				<br />
				<input
					type="text"
					v-model="loginCred.email"
					placeholder="Email"
				/>
				<br />
				<!-- <input
					type="text"
					v-model="loginCred.password"
					placeholder="Password"
				/>
				<br /> -->
				<button>Login</button>
                <h5 class="login-signup-txt">Not a user? <a href="#" @click="toggleLogin">Sign Up</a></h5>
			</form>

			<form @submit.prevent="doSignup" v-else>
				<input
					type="text"
					v-model="signupCred.userName"
					placeholder="Username"
				/>
				<br />
				<input
					type="text"
					v-model="signupCred.email"
					placeholder="Email"
				/>
				<br />
				<!-- <input
					type="text"
					v-model="signupCred.password"
					placeholder="Password"
				/>
				<br /> -->
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
				<br />
				<button>Signup</button>
                <h5 class="login-signup-txt">Already a user? <a href="#" @click="toggleLogin">Login</a></h5>
			</form>
		</div>
		<hr />
		<!-- <button @click="getAllUsers">Get All Users</button> -->
		<!-- <ul>
			<li v-for="user in users" :key="user._id">
				<pre>{{ user }}</pre>
			</li>
		</ul> -->
	</section>
</template>

<script>
import { uploadImg } from '@/services/img-upload.service.js';

export default {
	name: 'login-page',
	data() {
		return {
			loginCred: {},
			signupCred: {},
			msg: '',
            userToEdit: {},
            isLoading: false,
            isLogin: true
		};
	},
	computed: {
		users() {
			return this.$store.getters.users;
		},
		loggedinUser() {
			return this.$store.getters.loggedinUser;
		}
	},
	created() {
		console.log('this.loggedinUser', this.loggedinUser);
	},
	methods: {
		async doLogin() {
			const cred = this.loginCred;
			if (!cred.email || !cred.userName) return this.msg = 'Please enter user/password';
			await this.$store.dispatch({ type: 'login', userCred: cred });
			this.loginCred = {};

		},
		doLogout() {
			this.$store.dispatch({ type: 'logout' });
		},
		doSignup() {
			const cred = this.signupCred;
			if (!cred.email || !cred.userName) return this.msg = 'Please fill up the form';
			cred.msgs = [];
			this.$store.dispatch({ type: 'signup', userCred: cred });
		},
		getAllUsers() {
			this.$store.dispatch({ type: 'loadUsers' });
		},
		removeUser(userId) {
			this.$store.dispatch({ type: 'removeUser', userId });
		},
		updateUser() {
			this.$store.dispatch({ type: 'updateUser', user: this.userToEdit });
        },
        async onUploadImg(ev) {
			this.isLoading = true;
			const res = await uploadImg(ev);
			this.signupCred.imgUrl = res.url;
			this.isLoading = false;
        },
        toggleLogin() {
            this.isLogin = !this.isLogin;
        }
	},
	watch: {
		loggedinUser() {
			this.userToEdit = { ...this.loggedinUser };
		}
	}
}
</script>