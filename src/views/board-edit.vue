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
        <li class="list" v-for="(list, listIdx) in lists" :key="list.id">
          <list :list="list" :listIdx="listIdx" :members="members" 
            @removeList="removeList" @openTask="openTask" 
            @removeTask="removeTask" @addTask="addTask"/>
        </li>
      </ul>
      <button class="add-list-btn" @click="addList">Add list</button>
    </div>
    <task-details 
      v-if="currTask" 
      :task="currTask" :activites="board.activities" :members="members"
      @addItem="addItem" @updateTask="updateTask" @close="closeDetails" 
      @removeItem="removeItem" @toggleCheck="toggleCheck" @addComment="addComment"
    />
  </div>
</template>

<script>
import { boardService } from "../services/board.service.js";
import { userService } from "../services/user.service.js";
import boardNav from "../cmps/board-nav/board-nav.cmp";
import taskDetails from "../cmps/task-details.cmp";
import list from '../cmps/list.cmp'
import {eventBusService} from '../services/eventBus.service'

export default {
  name: "board-edit",
  data() {
    return {
      board: null,
      members: [],
      currTask: null,
      currListIdx: null,
      currTaskIdx: null
    };
  },
  methods: {
    addList() {
      var newList = boardService.getEmptyList();
      newList.name = prompt("Enter List name");
      if (!newList.name) return;
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
    addComment(commentTxt){
      var comment = {
        txt: commentTxt,
        createdAt: Date.now(),
        creator: this.$store.getters.loggedInUser ? this.$store.getters.loggedInUser.fullName : "Guest"
      }
      this.currTask.comments.push(comment)
      this.updateBoard();
    },
    openTask(idxs) {
      this.currTask = this.board.lists[idxs.listIdx].tasks[idxs.taskIdx];
      this.currListIdx = idxs.listIdx;
      this.currTaskIdx = idxs.taskIdx;
    },
    addTask(updates) {
      var newTask = boardService.getEmptyTask();
      newTask.name = updates.title;
      this.board.lists[updates.listIdx].tasks.push(newTask);
      this.updateBoard();
    },
    removeTask(idxs){
      this.board.lists[idxs.listIdx].tasks.splice(idxs.taskIdx, 1)
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
        const currCheckLists = this.currTask.checkLists;
        const newChechList = {
          title: updates.title,
          items: updates.items,
        };
        currCheckLists.push(newChechList);
      }
      if (updates.type === "addMemberToTask") {
        this.currTask.members.push(updates.value);
      }
      if (updates.type === "removeMemberToTask") {
        this.currTask.members.splice(updates.value, 1);
      }
      if (updates.type === "updateDueDate") {
        this.currTask.dueDate = updates.value;
      }
      if (updates.type === "updateTaskName") {
        this.currTask.name = updates.value.name;
      }
      if (updates.type === "updateTaskDesc") {
        this.currTask.description = updates.value.description;
      }
      this.updateBoard();
    },
    addItem(item) {
      const currCheckListItems = this.currTask.checkLists[item.checkListIdx].items;
      const newItem = {
        txt: item.txt,
        isDone: item.isDone,
      };
      currCheckListItems.push(newItem);
      this.updateBoard();
    },
    removeItem(idxs){
      this.currTask.checkLists[idxs.checkListIdx].items.splice(idxs.itemIdx, 1);
      this.updateBoard();
    },
    toggleCheck(idxs){
      this.currTask.checkLists[idxs.checkListIdx].items[idxs.itemIdx].isDone = 
      !this.currTask.checkLists[idxs.checkListIdx].items[idxs.itemIdx].isDone
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
  computed: {
    lists(){
      return this.board.lists
    }
  },
  components: {
    boardNav,
    taskDetails,
    list
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
    console.log("fghjklkjgfdhjkj");
  },
};
</script>