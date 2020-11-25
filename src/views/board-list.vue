<template>
	<div>
		<template v-if="userBoards.length">
			<h2>User Boards:</h2>
			<ul>
				<li v-for="board in userBoards" :key="board._id">
					<router-link :to="'/board/' + board._id">{{
						board.name
					}}</router-link>
				</li>
				<li>
					<button @click="addBoard">add board</button>
				</li>
			</ul>
			<hr />
		</template>
		<h2>Public Boards:</h2>
		<ul>
			<li v-for="board in publicBoards" :key="board._id">
				<router-link :to="'/board/' + board._id">{{
					board.name
				}}</router-link>
			</li>
			<li v-if="!userBoards">
				<button @click="addBoard">add board</button>
			</li>
		</ul>
		<hr />
		<h2>Templates:</h2>
		<ul>
			<li v-for="board in templateBoards" :key="board._id">
				<router-link :to="'/board/' + board._id">{{
					board.name
				}}</router-link>
			</li>
		</ul>
	</div>
</template>

<script>

import { boardService } from '../services/board.service.js';

export default {
	name: 'board-list',
	data() {
		return {
			boards: [],
		};
	},
	methods: {
		async addBoard() {
			var newBoard = boardService.getEmptyBoard();
			newBoard.name = prompt('Enter Board name');
			var saveBoard = await this.$store.dispatch({
				type: 'saveBoard',
				board: newBoard
			});
			this.$router.push(`/board/${saveBoard._id}`);
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
		}
	},
	created() {
		this.$store.dispatch({
			type: 'loadBoards',
		});
	}
}
</script>