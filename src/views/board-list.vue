<template>
	<section>
		<template v-if="userBoards.length">
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
									<!-- <time class="time">{{ currentDate }}</time> -->
								</div>
							</div>
						</el-card>
					</router-link>
				</el-col>
			</el-row>
			<hr />
		</template>
		<h2>Public Boards:</h2>
		<el-row>
			<el-col v-if="!userBoards.length" :span="2" :offset="0">
				<el-card @click.native="addBoard"
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
					<el-card :body-style="{ padding: '0px' }">
						<div style="padding: 14px">
							<span>{{ board.name }}</span>
							<div class="bottom clearfix">
								<!-- <time class="time">{{ currentDate }}</time> -->
							</div>
						</div>
					</el-card>
				</router-link>
			</el-col>
		</el-row>
		<hr />
		<h2>Templates:</h2>
		<ul>
			<li v-for="board in templateBoards" :key="board._id">
				<router-link :to="'/board/' + board._id">{{
					board.name
				}}</router-link>
			</li>
		</ul>
		<el-carousel :interval="4000" type="card" height="200px">
			<el-carousel-item v-for="item in 6" :key="item">
				<h3 class="medium">{{ item }}</h3>
			</el-carousel-item>
		</el-carousel>
	</section>
</template>

<script>
import { boardService } from "../services/board.service.js";

export default {
	name: "board-list",
	data() {
		return {
			boards: [],
		};
	},
	methods: {
		async addBoard() {
			const user = this.$store.getters.loggedInUser;
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
	},
	created() {
		this.$store.dispatch({
			type: "loadBoards",
		});
	},
};
</script>

<style>
/* .time {
  font-size: 13px;
  color: #999;
} */

div.el-card:hover {
	cursor: pointer;
	box-shadow: 0 0 4px rgba(0, 0, 0, 0.63);
}

.el-card .plus-icon {
	margin: 0 auto;
	height: 20px;
}

.bottom {
	margin-top: 13px;
	line-height: 12px;
}

.button {
	padding: 0;
	float: right;
}

.image {
	width: 100%;
	display: block;
}

.clearfix:before,
.clearfix:after {
	display: table;
	content: "";
}

.clearfix:after {
	clear: both;
}
.el-carousel__item h3 {
	color: #475669;
	font-size: 14px;
	opacity: 0.75;
	line-height: 200px;
	margin: 0;
}

.el-carousel__item:nth-child(2n) {
	background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
	background-color: #d3dce6;
}
</style>