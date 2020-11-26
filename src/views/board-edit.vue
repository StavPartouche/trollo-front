<template>
  <div class="board-edit">
    <board-nav
      @removeBoardMember="removeBoardMember"
      @addBoardMember="addBoardMember"
      @removeBoard="removeBoard"
      @saveBoard="saveBoardSettings"
      v-if="board"
      :board="board"
      :members="members"
    ></board-nav>
    <div class="lists-container">
      <ul class="lists" v-if="board">
        <li class="list" v-for="(list, listIdx) in board.lists" :key="list.id">
          <h2>{{ list.name }}</h2>
          <button @click="removeList(listIdx)">Delete List</button>
          <ul>
            <li
              class="task"
              v-for="(task, taskIdx) in list.tasks"
              :key="task.id"
              @click="openTask(listIdx, taskIdx)"
            >
              <p>{{ task.name }}</p>
              <ul v-if="task.members.length">
                <li v-for="memberId in task.members" :key="memberId">
                  {{ getMemberImgById(memberId) }}
                </li>
              </ul>
              <button @click.stop="removeTask(listIdx, taskIdx)">
                Delete Task
              </button>
            </li>
          </ul>
          <button class="add-task-btn" @click="addTask(listIdx)">
            + Add task
          </button>
        </li>
      </ul>
      <button class="add-list-btn" @click="addList">Add list</button>
    </div>
    <task-details
      v-if="currTask"
      :task="currTask"
      :activites="board.activities"
      :members="members"
      @addItem="addItem"
      @updateTask="updateTask"
      @close="closeDetails"
    />
  </div>
</template>

<script>
import { boardService } from "../services/board.service.js";
import { userService } from "../services/user.service.js";
import boardNav from "../cmps/board-nav/board-nav.cmp";
import taskDetails from "../cmps/task-details.cmp";
import { eventBusService } from "../services/eventBus.service";

export default {
  name: "board-edit",
  data() {
    return {
      board: null,
      members: [],
      currTask: null,
      currListIdx: null,
      currTaskIdx: null,
    };
  },
  methods: {
    getMemberImgById(id) {
      const arr = this.members.filter((member) => member._id === id);
      if (!arr.length) return;
      return arr[0].imgUrl;
    },
    addList() {
      var newList = boardService.getEmptyList();
      newList.name = prompt("Enter List name");
      this.board.lists.push(newList);
      this.updateBoard();
    },
    removeList(listIdx) {
      const confirmRemove = confirm("sure?");
      if (confirmRemove) {
        this.board.lists.splice(listIdx, 1);
        this.updateBoard();
      }
    },
    openTask(listIdx, taskIdx) {
      this.currTask = this.board.lists[listIdx].tasks[taskIdx];
      this.currListIdx = listIdx;
      this.currTaskIdx = taskIdx;
    },
    addTask(listIdx) {
      var newTask = boardService.getEmptyTask();
      newTask.name = prompt("Enter Task name");
      this.board.lists[listIdx].tasks.push(newTask);
      this.updateBoard();
    },
    removeTask(listIdx, taskIdx) {
      this.board.lists[listIdx].tasks.splice(taskIdx, 1);
      this.updateBoard();
    },
    closeDetails() {
      this.currTask = null;
    },
    async getMember(memberId) {
      const member = await userService.getById(memberId);
      return member;
    },
    saveBoardSettings(board) {
      this.board = board;
      this.updateBoard();
    },
    updateBoard() {
      this.$store.dispatch({
        type: "saveBoard",
        board: this.board,
      });
      eventBusService.$emit("boardBgc", this.board.style.url);
    },
    updateTask(updates) {
      if (updates.type === "checkList") {
        const currCheckLists = this.board.lists[this.currListIdx].tasks[
          this.currTaskIdx
        ].checkLists;
        const newChechList = {
          title: updates.title,
          items: updates.items,
        };
        currCheckLists.push(newChechList);
      }
      if (updates.type === "addMemberToTask") {
        this.board.lists[this.currListIdx].tasks[this.currTaskIdx].members.push(
          updates.value
        );
        console.log(this.board);
      }
      if (updates.type === "removeMemberToTask") {
        this.board.lists[this.currListIdx].tasks[
          this.currTaskIdx
        ].members.splice(updates.value, 1);
      }
      if (updates.type === "updateDueDate") {
        this.board.lists[this.currListIdx].tasks[this.currTaskIdx].dueDate =
          updates.value;
      }
      if (updates.type === "updateTaskName") {
        this.board.lists[this.currListIdx].tasks[this.currTaskIdx] =
          updates.value;
      }
      this.updateBoard();
    },
    addItem(item) {
      const currCheckListItems = this.board.lists[this.currListIdx].tasks[
        this.currTaskIdx
      ].checkLists[item.checkListIdx].items;
      const newItem = {
        txt: item.txt,
        isDone: item.isDone,
      };
      currCheckListItems.push(newItem);
      this.updateBoard();
    },
    async getMember(memberId) {
      const member = await userService.getById(memberId);
      return member;
    },
    async removeBoard() {
      await this.$store.dispatch({
        type: "removeBoard",
        boardId: this.board._id,
      });
      this.$router.push("/board");
    },
    async addBoardMember(memberId) {
      console.log(memberId);
      this.board.members.push(memberId);
      this.updateBoard();
      const memberObject = await this.getMember(memberId);
      this.members.push(memberObject);
    },
    removeBoardMember(memberId) {
      const idx = this.board.members.findIndex((member) => member === memberId);
      this.board.members.splice(idx, 1);
      this.updateBoard();
      this.members.findIndex((member) => member._id === memberId)
      this.members.splice(idx, 1);
    },
  },
  computed: {},
  components: {
    boardNav,
    taskDetails,
  },
  async created() {
    const boardId = this.$route.params.id;
    const board = await boardService.getById(boardId);
    board.members.forEach(async (member) => {
      var memberObject = await this.getMember(member);
      this.members.push(memberObject);
    });
    this.board = JSON.parse(JSON.stringify(board));
    eventBusService.$emit("boardBgc", this.board.style.url);
    // this.currTask = this.board.lists[1].tasks[0]
  },
};
</script>