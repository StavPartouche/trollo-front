<template>
	<section class="board-list">
		<template v-if="loggedInUser">
			<h2>User Boards:</h2>
			<el-row>
				<el-col :span="2" :offset="0">
					<el-card @click.native="addBoard"
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
						<el-card :body-style="{ padding: '0px' }">
							<div style="padding: 14px">
								<span>{{ board.name }}</span>
								<div class="bottom clearfix">
								</div>
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
				<el-card class="flex center"  :body-style="{height: '75px'}"  @click.native="addBoard"
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
							<div class="bottom clearfix">
							</div>
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
import {eventBusService} from '../services/eventBus.service'


export default {
	name: "board-list",
	data() {
		return {
			boards: [],
		};
	},
	methods: {
		async addBoard() {
			const user = this.loggedInUser;
			var newBoard = (user) ? boardService.getEmptyBoard(user._id) : boardService.getEmptyBoard();
			newBoard.name = prompt("Enter Board name");
			if (!newBoard.name) return;
			var saveBoard = await this.$store.dispatch({
				type: "saveBoard",
				board: newBoard,
			});
			this.$router.push(`/board/${saveBoard._id}`);
		},
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
		this.$store.dispatch({
			type: "loadBoards",
    });
	eventBusService.$emit('boardBgc', 'desk3.jpg')
	},

};
</script>