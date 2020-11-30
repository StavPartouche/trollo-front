<template>
  <div class="board-edit flex-column">
    <board-nav
      @toggleMenu="toggleMenu"
      @updateBoardName="updateBoardName"
      @removeBoardMember="removeBoardMember"
      @addBoardMember="addBoardMember"
      v-if="board"
      :name="board.name"
      :members="members"
    ></board-nav>
      <!-- @saveBoard="saveBoardSettings" -->
    <board-menu
      v-if="isMenu"
      @removeBoard="removeBoard"
      @saveBoardBgc="saveBoardBgc"
      @updateBoardName="updateBoardName"
      @changeDesc="changeDesc"
      @changeDueDate="changeDueDate"
      :name="board.name"
      :description="board.description"
      :dueDate="board.dueDate"
    ></board-menu>
    <vue-scroll class="vuescroll" :ops="ops">
      <!-- <div class=""> -->
        <!-- <ul class="lists lists-container flex" v-if="board"> -->
        <ul class="lists" v-if="board">
          <draggable
            class="flex"
            :list="board.lists"
            v-bind="dragOptions"
            group="lists"
            @sort="updateBoard"
          >
            <li
              class="list"
              v-for="(list, listIdx) in board.lists"
              :key="list.id"
            >
              <list
                :list="list"
                :listIdx="listIdx"
                :members="members"
                @removeList="removeList"
                @openTask="openTask"
                @addTask="addTask"
                @updateList="updateBoard"
                @updateListName="updateListName"
              />
            </li>
          </draggable>
          <li>

        <button class="add-list-btn" @click="addList">
          <i class="fas fa-plus"></i><span>Add list</span>
        </button>
          </li>
        </ul>
    </vue-scroll>
    <task-details
      v-if="currTask"
      :task="currTask"
      :activites="board.activities"
      :members="members"
      :labels="board.labels"
      @toggleCheck="toggleCheck"
      @addItem="addItem"
      @addCheckList="addCheckList"
      @addMemberToTask="addMemberToTask"
      @removeMemberfromTask="removeMemberfromTask"
      @updateDueDate="updateDueDate"
      @updateTaskName="updateTaskName"
      @updateTaskDesc="updateTaskDesc"
      @UploadImg="UploadImg"
      @close="closeDetails"
      @removeItem="removeItem"
      @removeAttachment="removeAttachment"
      @setPreviewImg="setPreviewImg"
      @removePreviewImg="removePreviewImg"
      @addComment="addComment"
      @removeCheckList="removeCheckList"
      @toggleLabel="toggleLabel"
      @setTaskColor="setTaskColor"
      @removeTask="removeTask"
    />
  </div>
</template>

<script>
import { boardService } from "../services/board.service.js";
import { userService } from "../services/user.service.js";
import boardNav from "../cmps/board-nav/board-nav.cmp";
import boardMenu from "../cmps/board-menu/board-menu.cmp";
import taskDetails from "../cmps/task-details/task-details.cmp";
import list from "../cmps/list.cmp";
import { eventBusService } from "../services/eventBus.service";
import draggable from "vuedraggable";

export default {
  name: "board-edit",
  data() {
    return {
      board: null,
      members: [],
      currTask: null,
      currListIdx: null,
      currTaskIdx: null,
      ops: {
        scrollPanel: {},
        rail: {
          background: "rgba(0, 0, 0, 0.404)",
          size: "20px",
          opacity: "0.1",
        },
        bar: {
          onlyShowBarOnScroll: false,
          keepShow: true,
          size: "15px",
          opacity: "0.7",
          minSize: 0,
        },
      },
      isMenu: false,
    };
  },
  methods: {
    // BOARD-NAV
    toggleMenu(ev) {
      this.isMenu = ev;
    },
    updateBoardName(name) {
      this.board.name = name;
      this.updateBoard();
    },
    removeBoardMember(memberId) {
      var idx = this.board.members.findIndex((member) => member === memberId);
      if (idx === -1) return;
      this.board.members.splice(idx, 1);
      this.updateBoard();
      idx = this.members.findIndex((member) => member._id === memberId);
      this.members.splice(idx, 1);
    },
    async addBoardMember(memberId) {
      this.board.members.push(memberId);
      this.updateBoard();
      const memberObject = await this.getMember(memberId);
      this.members.push(memberObject);
    },

    // BOARD-MENU
    async removeBoard() {
      await this.$store.dispatch({
        type: "removeBoard",
        boardId: this.board._id,
      });
      this.$router.push("/board");
    },
    changeDesc(desc) {
      this.board.description = desc;
      this.updateBoard();
    },
    changeDueDate(dueDate) {
      this.board.dueDate = dueDate;
      this.updateBoard();
    },
    saveBoardBgc(bgc) {
      if (bgc.type === "img") {
        this.board.style.url = bgc.img;
      } else {
        this.board.style.url = "color";
        this.board.style.backgroundColor = bgc.color;
      }
      eventBusService.$emit("boardBgc", this.board.style);
      this.updateBoard();
    },

    // LIST
    removeList(listIdx) {
      const confirmRemove = confirm("sure?");
      if (confirmRemove) {
        this.board.lists.splice(listIdx, 1);
        this.updateBoard();
      }
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
    updateListName(updates) {
      this.board.lists[updates.listIdx].name = updates.newName;
      this.updateBoard();
    },

    // TASK-DETAILS
  toggleCheck(idxs) {
      this.currTask.checkLists[idxs.checkListIdx].items[
        idxs.itemIdx
      ].isDone = !this.currTask.checkLists[idxs.checkListIdx].items[
        idxs.itemIdx
      ].isDone;
      this.updateBoard();
    },
    addItem(item) {
      const currCheckListItems = this.currTask.checkLists[item.checkListIdx]
        .items;
      const newItem = {
        txt: item.txt,
        isDone: item.isDone,
      };
      currCheckListItems.push(newItem);
      this.updateBoard();
    },
    addCheckList(checkListData){
      console.log('1');
      const currCheckLists = this.currTask.checkLists;
        const newChechList = {
          title: checkListData.title,
          items: checkListData.items,
        };
        currCheckLists.push(newChechList);
        this.updateBoard();
    },
    addMemberToTask(memberId){
      this.currTask.members.push(memberId);
      this.updateBoard();
    },
    removeMemberfromTask(memberIdx){
      this.currTask.members.splice(memberIdx, 1);
      this.updateBoard();
    },
    updateDueDate(newDate){
      this.currTask.dueDate = newDate;
      this.updateBoard();
    },
    updateTaskName(newName){
      this.currTask.name = newName;
      this.updateBoard();
    },
    updateTaskDesc(newDwsc){
      this.currTask.description = newDwsc;
      this.updateBoard();
    },
    UploadImg(imgUrl){
      this.currTask.attachments.push(imgUrl);
      this.updateBoard();
    },
    closeDetails() {
      this.currTask = null;
    },
    removeItem(idxs) {
      this.currTask.checkLists[idxs.checkListIdx].items.splice(idxs.itemIdx, 1);
      this.updateBoard();
    },
    removeAttachment(idx) {
      this.currTask.attachments.splice(idx, 1);
      this.updateBoard();
    },
    setPreviewImg(idx) {
      this.currTask.previewImg = this.currTask.attachments[idx];
      this.updateBoard();
    },
    addComment(commentTxt) {
      var comment = {
        txt: commentTxt,
        createdAt: Date.now(),
        creator: this.$store.getters.loggedInUser
          ? this.$store.getters.loggedInUser
          : { fullName: "Guest" },
      };
      this.currTask.comments.push(comment);
      this.updateBoard();
    },
    removeCheckList(idx) {
      this.currTask.checkLists.splice(idx, 1);
      this.updateBoard();
    },
    toggleLabel(label) {
      const idx = this.currTask.labels.findIndex(
        (currLabel) => currLabel.backgroundColor === label.backgroundColor
      );
      if (idx === -1) this.currTask.labels.push(label);
      else this.currTask.labels.splice(idx, 1);
      this.updateBoard();
    },
    setTaskColor(bgc) {
      this.currTask.backgroundColor = bgc;
      this.updateBoard();
    },
    removeTask() {
      this.board.lists[this.currListIdx].tasks.splice(this.currTaskIdx, 1);
      this.currTask = null;
      this.updateBoard();
    },
    removePreviewImg() {
      this.currTask.previewImg = "";
      this.updateBoard();
    },
    
    // GENERAL BOARD
    addList() {
      var newList = boardService.getEmptyList();
      newList.name = prompt("Enter List name");
      if (!newList.name) return;
      this.board.lists.push(newList);
      this.updateBoard();
    },
    async getMember(memberId) {
      const member = await userService.getById(memberId);
      return member;
    },
    updateBoard() {
      this.$store.dispatch({
        type: "saveBoard",
        board: this.board,
      });
      // eventBusService.$emit("boardBgc", { type:'img', img:this.board.style.url});
      eventBusService.$emit("boardBgc", this.board.style);
    },
  },
  computed: {
    lists() {
      return this.board.lists;
    },
    dragOptions() {
      return {
        animation: 200,
        group: "lists",
        disabled: false,
        ghostClass: "ghost",
      };
    },
  },
  components: {
    boardNav,
    taskDetails,
    list,
    draggable,
    boardMenu,
  },
  async created() {
    const boardId = this.$route.params.id;
    const board = await boardService.getById(boardId);
    board.members.forEach(async (member) => {
      var memberObject = await this.getMember(member);
      this.members.push(memberObject);
    });
    this.board = JSON.parse(JSON.stringify(board));
    eventBusService.$emit("boardBgc", this.board.style);
    // this.currTask = this.board.lists[0].tasks[0]
  },
};
</script>