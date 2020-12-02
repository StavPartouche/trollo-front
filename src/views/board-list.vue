<template>
	<section class="board-list">
		<template v-if="loggedInUser">
			<h2>User Boards:</h2>
			<el-row class="flex justify-center wrap">
				<el-col :span="2" :offset="0">
					<el-card @click.native="openPrompt"
						><img class="plus-icon" src="../styles/assets/plus.png"
					/></el-card>
				</el-col>
				<el-col
					:span="4"
					v-for="board in userBoards"
					:key="board._id"
					:offset="1"
				>
					<router-link :to="'/board/' + board._id">
						<el-card
							class="flex center"
							:body-style="{ padding: '0px' }"
						>
							<div style="padding: 14px">
								<span>{{ board.name }}</span>
								<div class="bottom clearfix"></div>
							</div>
						</el-card>
					</router-link>
				</el-col>
			</el-row>
			<hr />
		</template>
		<h2>Public Boards:</h2>
		<el-row class="flex justify-center wrap">
			<el-col v-if="!loggedInUser" :span="2" :offset="0">
				<el-card
					class="flex center"
					:body-style="{ height: '75px' }"
					@click.native="openPrompt"
					><img class="plus-icon" src="../styles/assets/plus.png"
				/></el-card>
			</el-col>
			<el-col
				:span="4"
				v-for="board in publicBoards"
				:key="board._id"
				:offset="1"
			>
				<router-link :to="'/board/' + board._id">
					<el-card :body-style="{ padding: '0px', height: '75px' }">
						<div style="padding: 14px">
							<span>{{ board.name }}</span>
							<div class="bottom clearfix"></div>
						</div>
					</el-card>
				</router-link>
			</el-col>
		</el-row>
		<hr />
		<h2>Templates:</h2>
		<!-- <ul>
			<li v-for="board in templateBoards" :key="board._id">
				<router-link :to="'/board/' + board._id">{{
					board.name
				}}</router-link>
			</li>
		</ul> -->
		<el-carousel :interval="4000" type="card" height="200px">
			<el-carousel-item v-for="board in templateBoards" :key="board._id">
				<h3 class="medium">{{ board.name }}</h3>
			</el-carousel-item>
		</el-carousel>
	</section>
</template>

<script>
import { boardService } from "../services/board.service.js";
import { eventBusService } from '../services/eventBus.service';
import socket from '@/services/socket.service';
import io from 'socket.io-client';

export default {
	name: "board-list",
	data() {
		return {
			boards: [],
		};
	},
	methods: {
		async addBoard(value) {
			const user = this.loggedInUser;
			var newBoard = (user) ? boardService.getEmptyBoard(user._id) : boardService.getEmptyBoard();
			newBoard.name = value
			var saveBoard = await this.$store.dispatch({
				type: "saveBoard",
				board: newBoard,
			});
			socket.emit('addBoard');
			this.$router.push(`/board/${saveBoard._id}`);
		},
		openPrompt() {
		console.log('here');
        this.$prompt('Please enter new board name', 'Create new board', {
          confirmButtonText: 'Create',
		  cancelButtonText: 'Cancel',
		  inputValidator: this.validateInput,
		  inputErrorMessage: 'Enter board name'
        }).then(({ value }) => {
			this.addBoard(value)
          	this.$message({
            type: 'success',
            message: 'New board: ' + value + ' was created'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Input canceled'
          });       
        });
	  },
	  validateInput(input){
		  if(!input) return false
		  else return true
	  }
	},
	computed: {
		userBoards() {
			return this.$store.getters.userBoardsForDisplay;
		},
		publicBoards() {
			return this.$store.getters.publicBoardsForDisplay;
		},
		templateBoards() {
			return this.$store.getters.templatesForDisplay;
		},
		loggedInUser() {
			return this.$store.getters.loggedInUser;
		}
	},
	created() {
		const user = (sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')) : { userName: 'guest' };
		socket.setup(user);
		socket.emit('userConnect', user);
		socket.on('removeBoard', () => this.$store.dispatch({type: 'loadBoards'}));
		socket.on('addBoard', () => this.$store.dispatch({type: 'loadBoards'}));
		this.$store.dispatch({
			type: "loadBoards",
		});
		// eventBusService.$emit('boardBgc', {type: 'img', img:'desk3.jpg'})
		eventBusService.$emit('boardBgc', { url: 'desk5.jpg' });
	},
	destroyed() {
		socket.off('removeBoard');
		socket.terminate();
	}
};
</script>