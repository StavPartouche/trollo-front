<template>
  <section class="board-list background-image flex-column align-center">
    <template v-if="loggedInUser">
      <div class="grid-container felx center">
        <div class="grid">
          <h2>User Boards</h2>
          <div
            class="board-preview add-board-card flex center"
            @click="openPrompt"
          >
            <div class="add-board-card-header flex-column center">
              <font-awesome-icon class="plus-icon" :icon="['fas', 'plus']" />
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
      </div>
      <hr />
    </template>
    <div class="grid-container felx center">
      <div class="grid">
        <h2>Public Boards</h2>
        <div
          v-if="!loggedInUser"
          class="board-preview add-board-card flex center"
          @click="openPrompt"
        >
          <div class="add-board-card-header flex-column center">
            <font-awesome-icon class="plus-icon" :icon="['fas', 'plus']" />
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
    </div>
    <!-- <div class="footer-board-list"></div> -->
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
    validateInput(input) {
      if (!input) return false;
      else return true;
    },
    loadBoards() {
      this.$store.dispatch({ type: "loadBoards" });
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
    },
  },
  created() {
    const user = sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user"))
      : { userName: "guest" };
    socket.setup(user);
    socket.emit("userConnect", user);
    socket.emit("boardList");
    socket.on("removeBoard", this.loadBoards);
    socket.on("addBoard", this.loadBoards);
    this.loadBoards();
    // eventBusService.$emit('boardBgc', { url: 'desk9.jpg' });
  },
  destroyed() {
    socket.terminate();
  },
};
</script>