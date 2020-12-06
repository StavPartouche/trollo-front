<template>
  <section class="board-list background-image">
    <template v-if="loggedInUser">
      <h2>User Boards</h2>
      <div class="grid-container felx center">
        <div class="grid">
			<div class="board-preview add-board-card flex center" @click="openPrompt">
          <div class="add-board-card-header flex-column center">
            <font-awesome-icon class="plus-icon" :icon="['fas', 'plus']" />
            <!-- <h2>CREAT BOARD</h2> -->
          </div>
			</div>
          <router-link
            :to="'/board/' + board._id"
            v-for="board in userBoards"
            :key="board._id"
          >
            <div
              class="flex-column align-center justify-start board-preview background-image"
              :style="boardBackgorund(board.style)"
            >
              <div class="card-header-container">
                <span class="card-header">{{ board.name }}</span>
              </div>
            </div>
          </router-link>
        </div>

        <!-- <el-row class="grid">
					<el-col :span="2" :offset="0">
						<el-card class="add-board-card" @click.native="openPrompt">
							<div class="add-board-card-header flex center">
								<font-awesome-icon class="plus-icon" :icon="['fas', 'plus']" />
								<h2>CREAT BOARD</h2>
							</div>
						</el-card>
					</el-col>
					<el-col
						:span="4"
						v-for="board in userBoards"
						:key="board._id"
						:offset="0"
					>
						<router-link :to="'/board/' + board._id">
							<el-card
								class="flex center background-image"
								:body-style="{ padding: '0px', }"
								:style="boardBackgorund(board.style)"
							>
								<div class="card-header-container">
									<span class="card-header">{{ board.name }}</span>
									
								</div>
							</el-card>
						</router-link>
					</el-col>
				</el-row> -->
      </div>
      <hr />
    </template>
    <h2>Public Boards</h2>
    <div class="grid-container felx center">
      <div class="grid">
		  			<div class="board-preview add-board-card flex center" @click="openPrompt">
        <div class="add-board-card-header flex-column center">
          <font-awesome-icon class="plus-icon" :icon="['fas', 'plus']" />
          <!-- <h2>CREAT BOARD</h2> -->
        </div>
		</div>
        <router-link
          :to="'/board/' + board._id"
          v-for="board in publicBoards"
          :key="board._id"
        >
          <div
            class="flex-column align-center justify-start board-preview background-image"
            :style="boardBackgorund(board.style)"
          >
            <div class="card-header-container">
              <span class="card-header">{{ board.name }}</span>
            </div>
          </div>
        </router-link>
      </div>
      <!-- <el-row class="grid">
				<el-col v-if="!loggedInUser" :span="2" :offset="0">
					<el-card class="add-board-card" @click.native="openPrompt">
								<div class="add-board-card-header flex center">
									<font-awesome-icon class="plus-icon" :icon="['fas', 'plus']" />
									<h2>CREAT BOARD</h2>
								</div>
							</el-card>
				</el-col>
				<el-col
					:span="4"
					v-for="board in publicBoards"
					:key="board._id"
					:offset="0"
				>
					<router-link :to="'/board/' + board._id">
						<el-card
								class="flex center background-image"
								:body-style="{ padding: '0px', }"
								:style="boardBackgorund(board.style)"
							>
								<div class="card-header-container">
									<span class="card-header">{{ board.name }}</span>
									
								</div>
							</el-card>
					</router-link>
				</el-col>
			</el-row> -->
    </div>
    <!-- <hr />
		<h2>Templates:</h2>
		<el-row class="flex justify-center wrap">
			<el-col
				:span="4"
				v-for="board in templateBoards"
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
		</el-row> -->
  </section>
</template>

<script>
import { boardService } from "../services/board.service.js";
import { eventBusService } from "../services/eventBus.service";
import socket from "@/services/socket.service";
import io from "socket.io-client";

export default {
  name: "board-list",
  data() {
    return {
      boards: [],
    };
  },
  methods: {
    boardBackgorund(style) {
      if (style.url === "color")
        return { backgroundColor: `${style.backgroundColor}` };
      else
        return {
          backgroundImage: `url(${require(`@/styles/assets/board-background-imgs/${style.url}`)})`,
        };
    },
    async addBoard(value) {
      const user = this.loggedInUser;
      var newBoard = user
        ? boardService.getEmptyBoard(user._id)
        : boardService.getEmptyBoard();
      newBoard.name = value;
      var saveBoard = await this.$store.dispatch({
        type: "saveBoard",
        board: newBoard,
      });
      socket.emit("addBoard");
      this.$router.push(`/board/${saveBoard._id}`);
    },
    openPrompt() {
      this.$prompt("Please enter new board name", "Create new board", {
        confirmButtonText: "Create",
        cancelButtonText: "Cancel",
        customClass: "create-prompt",
        inputValidator: this.validateInput,
        inputErrorMessage: "Enter board name",
      })
        .then(({ value }) => {
          this.addBoard(value);
          this.$message({
            type: "success",
            message: "New board: " + value + " was created",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Input canceled",
          });
        });
	  },
	  validateInput(input){
		  if(!input) return false
		  else return true
	  },
	  loadBoard() {
		  this.$store.dispatch({type: 'loadBoards'});
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
		socket.on('removeBoard', this.loadBoard());
		socket.on('addBoard', this.loadBoard());
		this.loadBoard();
		eventBusService.$emit('boardBgc', {url: 'desk6.jpg'})
		// eventBusService.$emit('boardBgc', { url: 'color', backgroundColor:'#ddd' });
	},
	destroyed() {
		socket.off('removeBoard', this.loadBoard());
		socket.off('addBoard', this.loadBoard());
		socket.terminate();
	}
};
</script>