<template>
  <div class="board-edit flex-column">
    <board-nav
      @toggleMenu="toggleMenu"
      @updateBoardName="updateBoardName"
      @removeBoardMember="updateBoardMember('remove', $event)"
      @addBoardMember="updateBoardMember('add', $event)"
      v-if="board"
      :name="board.name"
      :members="members"
    ></board-nav>
    <board-menu
      v-if="isMenu"
      @removeBoard="removeBoard"
      @saveBoardBgc="saveBoardBgc"
      @updateBoardName="updateBoardName"
      @updateBoardDesc="updateBoardDesc"
      @updateBoardDueDate="updateBoardDueDate"
      :name="board.name"
      :description="board.description"
      :dueDate="board.dueDate"
      :activities="board.activities"
    ></board-menu>
    <ul class="lists" v-if="board">
      <draggable
        class="flex"
        :list="board.lists"
        v-bind="dragOptions"
        group="lists"
      >
        <!-- @sort="updateBoard" -->
        <list
          v-for="(list, listIdx) in board.lists"
          :key="list.id"
          :list="list"
          :listIdx="listIdx"
          :members="members"
          :isNewList="isNewList"
          @removeList="removeList"
          @openTask="openTask"
          @addTask="addTask"
          @updateList="onDrag"
          @updateListName="updateListName"
        />
      </draggable>
      <li>
        <button class="add-list-btn" @click="addList">
          <i class="fas fa-plus"></i><span>Add list</span>
        </button>
      </li>
    </ul>
    <task-details
      v-if="currTask"
      :task="currTask"
      :activities="board.activities"
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
import { eventBusService } from "../services/eventBus.service";
import boardNav from "../cmps/board-nav/board-nav.cmp";
import boardMenu from "../cmps/board-menu/board-menu.cmp";
import taskDetails from "../cmps/task-details/task-details.cmp";
import list from "../cmps/list.cmp";
import draggable from "vuedraggable";
import socket from "@/services/socket.service";
import io from "socket.io-client";
import _ from "lodash";

export default {
	name: "board-edit",
	data() {
		return {
			board: null,
			members: [],
			currTask: null,
			currListIdx: null,
			currTaskIdx: null,
			isMenu: false,
			isNewList: false,
		};
	},
	methods: {
		// BOARD-NAV
		toggleMenu(ev) {
			this.isMenu = ev;
		},
		updateBoardName(name) {
      this.board.name = name;
      socket.emit('boardName', name);
      const activity = boardService.newActivity(
        `updated board name to "${name}"`,
        this.userId
      );
      this.board.activities.unshift(activity);
    },
    async removeBoardMember(memberId) {
      const fullMember = await this.getMember(memberId)
      const activity = boardService.newActivity(
        `removed ${fullMember.fullName} from board`,
        this.userId
      );
      this.board.activities.unshift(activity);
      var idx = this.board.members.findIndex((member) => member === memberId);
      if (idx === -1) return;
      this.board.members.splice(idx, 1);
      idx = this.members.findIndex((member) => member._id === memberId);
      this.members.splice(idx, 1);
    },
    async addBoardMember(memberId) {
      const fullMember = await this.getMember(memberId);
      const activity = boardService.newActivity(
        `added ${fullMember.fullName} to board`,
        this.userId
      );
      this.board.activities.unshift(activity);
      this.board.members.push(memberId);
      this.members.push(fullMember);
    },
    updateBoardMember(type, memberId) {
      if (type === 'remove') this.removeBoardMember(memberId);
      else this.addBoardMember(memberId);
      const ev = type + 'BoardMember';
      socket.emit(ev, memberId);
    },


    // BOARD-MENU
    async removeBoard() {
      await this.$store.dispatch({
        type: "removeBoard",
        boardId: this.board._id,
      });
      socket.emit('removeBoard', this.board._id);
      this.$router.push("/board");
    },
    updateBoardDesc(desc) {
      this.board.description = desc;
      const activity = boardService.newActivity(
        `updated board description`,
        this.userId
      );
      this.board.activities.unshift(activity);
    },
    updateBoardDueDate(dueDate) {
      this.board.dueDate = dueDate;
      const activity = boardService.newActivity(
        `updated board due date to ${dueDate}`,
        this.userId
      );
      this.board.activities.unshift(activity);
    },
    saveBoardBgc(bgc) {
      if (bgc.type === "img") {
        this.board.style.url = bgc.img;
      } else {
        this.board.style.url = "color";
        this.board.style.backgroundColor = bgc.color;
      }
      eventBusService.$emit("boardBgc", this.board.style);
      const activity = boardService.newActivity(
        `updated board background`,
        this.userId
      );
      this.board.activities.unshift(activity);
    },

    // LIST
    removeList(listIdx) {
      const activity = boardService.newActivity(
        `removed list "${this.board.lists[listIdx].name}"`,
        this.userId
      );
      this.board.activities.unshift(activity);
      this.board.lists.splice(listIdx, 1);
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
      const activity = boardService.newActivity(
        `added a new task "${newTask.name}"`,
        this.userId,
        newTask.id
      );
      this.board.activities.unshift(activity);
    },
    updateListName(updates) {
      this.board.lists[updates.listIdx].name = updates.newName;
      const activity = boardService.newActivity(
        `updated list name to "${updates.newName}"`,
        this.userId
      );
      this.board.activities.unshift(activity);
      socket.emit('listName', {listIdx: updates.listIdx, newName: updates.newName})
    },

    // TASK-DETAILS
    toggleCheck(idxs) {
      this.currTask.checkLists[idxs.checkListIdx].items[
        idxs.itemIdx
      ].isDone = !this.currTask.checkLists[idxs.checkListIdx].items[
        idxs.itemIdx
      ].isDone;
    },
    addItem(item) {
      const currCheckListItems = this.currTask.checkLists[item.checkListIdx]
        .items;
      const newItem = {
        txt: item.txt,
        isDone: item.isDone,
      };
      currCheckListItems.push(newItem);
    },
    addCheckList(checkListData) {
      const currCheckLists = this.currTask.checkLists;
      const newChechList = {
        title: checkListData.title,
        items: checkListData.items,
      };
      currCheckLists.push(newChechList);
      const activity = boardService.newActivity(
        `added checklist "${checkListData.title}" to ${this.currTask.name}`,
        this.userId,
        this.currTask.id
      );
      this.board.activities.unshift(activity);
    },
    async addMemberToTask(memberId) {
      const fullMember = await this.getMember(memberId);
      const activity = boardService.newActivity(
        `added ${fullMember.fullName} to ${this.currTask.name}`,
        this.userId,
        this.currTask.id
      );
      this.board.activities.unshift(activity);
      this.currTask.members.push(memberId);
    },
    async removeMemberfromTask(memberIdx) {
      const fullMember = await this.getMember(this.currTask.members[memberIdx]);
      const activity = boardService.newActivity(
        `removed ${fullMember.fullName} from ${this.currTask.name}`,
        this.userId,
        this.currTask.id
      );
      this.board.activities.unshift(activity);
      this.currTask.members.splice(memberIdx, 1);
    },
    updateDueDate(newDate) {
      this.currTask.dueDate = newDate;
      const activity = boardService.newActivity(
        `updated due date in ${this.currTask.name} to ${newDate}`,
        this.userId,
        this.currTask.id
      );
      this.board.activities.unshift(activity);
    },
    updateTaskName(newName) {
      this.currTask.name = newName;
      const activity = boardService.newActivity(
        `updated task name to ${newName}`,
        this.userId,
        this.currTask.id
      );
      this.board.activities.unshift(activity);
    },
    updateTaskDesc(newDwsc) {
      this.currTask.description = newDwsc;
      const activity = boardService.newActivity(
        `updated ${this.currTask.name}s description`,
        this.userId,
        this.currTask.id
      );
      this.board.activities.unshift(activity);
    },
    UploadImg(imgUrl) {
      this.currTask.attachments.push(imgUrl);
      const activity = boardService.newActivity(
        `added an attachment to ${this.currTask.name}`,
        this.userId,
        this.currTask.id
      );
      this.board.activities.unshift(activity);
    },
    closeDetails() {
      this.currTask = null;
    },
    removeItem(idxs) {
      this.currTask.checkLists[idxs.checkListIdx].items.splice(idxs.itemIdx, 1);
    },
    removeAttachment(idx) {
      this.currTask.attachments.splice(idx, 1);
      const activity = boardService.newActivity(
        `removed an attachment from ${this.currTask.name}`,
        this.userId,
        this.currTask.id
      );
      this.board.activities.unshift(activity);
    },
    setPreviewImg(idx) {
      this.currTask.previewImg = this.currTask.attachments[idx];
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
    },
    removeCheckList(idx) {
      const activity = boardService.newActivity(
        `removed checklist "${this.currTask.checkLists[idx].title}" from ${this.currTask.name}`,
        this.userId,
        this.currTask.id
      );
      this.board.activities.unshift(activity);
      this.currTask.checkLists.splice(idx, 1);
    },
    toggleLabel(label) {
      const idx = this.currTask.labels.findIndex(
        (currLabel) => currLabel.backgroundColor === label.backgroundColor
      );
      if (idx === -1) this.currTask.labels.push(label);
      else this.currTask.labels.splice(idx, 1);
    },
    setTaskColor(bgc) {
      this.currTask.backgroundColor = bgc;
      const activity = boardService.newActivity(
        `updated ${this.currTask.name} color`,
        this.userId,
        this.currTask.id
      );
      this.board.activities.unshift(activity);
    },
    removeTask() {
      const activity = boardService.newActivity(
        `removed ${this.currTask.name} from ${this.board.lists[this.currListIdx].name}`,
        this.userId,
        this.currTask.id
      );
      this.board.activities.unshift(activity);
      this.board.lists[this.currListIdx].tasks.splice(this.currTaskIdx, 1);
      this.currTask = null;
    },
    removePreviewImg() {
      this.currTask.previewImg = "";
    },

    // GENERAL BOARD
    async addList() {
      var newList = boardService.getEmptyList("Enter list name");
      this.board.lists.push(newList);
      this.isNewList = true;
      const activity = boardService.newActivity(
        `added a list`,
        this.userId
      );
      this.board.activities.unshift(activity);
      this.isNewList = false;
    },
    async getMember(memberId) {
      const member = await userService.getById(memberId);
      return member;
    },
    async loadBoard(ev) {
      const updatedBoard = await boardService.getById(this.board._id);
      this.board = updatedBoard;
      await eventBusService.$emit("boardBgc", this.board.style);
      this.members = [];
      this.board.members.forEach(async (member) => {
        var memberObject = await this.getMember(member);
        this.members.push(memberObject);
      });
      if (this.currTask)
        this.currTask = this.board.lists[this.currListIdx].tasks[
          this.currTaskIdx
        ];
    },
    onDrag() {
    },
  },
  watch: {
        board: {
            handler: function (newBoard) {
                this.$store.dispatch({
                    type: "saveBoard",
                    board: newBoard
                });
            },
            deep: true
    }
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
    userId() {
      const user = this.$store.getters.loggedInUser;
      return user ? user._id : 'guest';
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
    // Sockets
    socket.setup();
    socket.on('listName', ({listIdx, name}) => this.board.lists[listIdx].name = name);
    socket.on('boardName', name => this.board.name = name);
    socket.on('removeBoardMember', id => this.removeBoardMember(id));
    socket.on('addBoardMember', id => this.addBoardMember(id));
    socket.on("updateBoard", this.loadBoard);
		socket.emit("enterBoard", board._id);
    
		this.onDrag = _.debounce(this.onDrag, 500);
		board.members.forEach(async (member) => {
			var memberObject = await this.getMember(member);
			this.members.push(memberObject);
		});
		this.board = JSON.parse(JSON.stringify(board));
		eventBusService.$emit("boardBgc", this.board.style);
		// this.currTask = this.board.lists[0].tasks[0]
	},
	destroyed() {
    socket.emit("leaveBoard");
    socket.off('listName');
    socket.off('boardName');
    socket.off('removeBoardMember');
    socket.off('addBoardMember');
    socket.off("updateBoard");
		socket.terminate();
	},
};
</script>