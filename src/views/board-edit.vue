<template>
  <div class="board-edit flex-column">
    <board-nav
      @removeBoardMember="removeBoardMember"
      @addBoardMember="addBoardMember"
      @removeBoard="removeBoard"
      @saveBoard="saveBoardSettings"
      v-if="board"
      :board="board"
      :members="members"
    ></board-nav>
    <vue-scroll class="vuescroll" :ops="ops">
      <div class="lists-container flex">
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
                @removeTask="removeTask"
                @addTask="addTask"
                @updateList="updateBoard"
                @updateListName="updateListName"
              />
            </li>
          </draggable>
        </ul>
        <button class="add-list-btn" @click="addList">
          <i class="fas fa-plus"></i><span>Add list</span>
        </button>
      </div>
    </vue-scroll>
    <task-details
      v-if="currTask"
      :task="currTask"
      :activites="board.activities"
      :members="members"
      @toggleCheck="toggleCheck"
      @addItem="addItem"
      @updateTask="updateTask"
      @close="closeDetails"
      @removeItem="removeItem"
      @removeAttachment="removeAttachment"
      @setPreviewImg="setPreviewImg"
      @removePreviewImg="removePreviewImg"
      @addComment="addComment"
      @removeCheckList="removeCheckList"
    />
  </div>
</template>

<script>
import { boardService } from "../services/board.service.js";
import { userService } from "../services/user.service.js";
import boardNav from "../cmps/board-nav/board-nav.cmp";
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
					background: 'rgba(0, 0, 0, 0.404)',
					size: '20px',
					opacity: '0.1',
				},
				bar: {
					onlyShowBarOnScroll: false,
					keepShow: true,
					size: '15px',
					opacity: '0.7',
					minSize: 0,
				},
			}
		};
	},
	methods: {
    removeCheckList(idx){
      this.currTask.checkLists.splice(idx, 1)
      this.updateBoard();
    },
		updateListName(updates) {
			this.board.lists[updates.listIdx].name = updates.newName;
			this.updateBoard();
		},
		removePreviewImg() {
			this.currTask.previewImg = '';
			this.updateBoard();
		},
		setPreviewImg(idx) {
			this.currTask.previewImg = this.currTask.attachments[idx];
			this.updateBoard();
		},
		removeAttachment(idx) {
			this.currTask.attachments.splice(idx, 1);
			this.updateBoard();
		},
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
		addComment(commentTxt) {
			var comment = {
				txt: commentTxt,
				createdAt: Date.now(),
				creator: this.$store.getters.loggedInUser ? this.$store.getters.loggedInUser.fullName : {fullName: "Guest" }
      };
      this.currTask.comments.push(comment);
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
    removeTask(idxs) {
      this.board.lists[idxs.listIdx].tasks.splice(idxs.taskIdx, 1);
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
      // eventBusService.$emit("boardBgc", { type:'img', img:this.board.style.url});
      eventBusService.$emit("boardBgc", this.board.style);
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
      if (updates.type === "UploadImg") {
        this.currTask.attachments.push(updates.value);
      }
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
    removeItem(idxs) {
      this.currTask.checkLists[idxs.checkListIdx].items.splice(idxs.itemIdx, 1);
      this.updateBoard();
    },
    toggleCheck(idxs) {
      this.currTask.checkLists[idxs.checkListIdx].items[
        idxs.itemIdx
      ].isDone = !this.currTask.checkLists[idxs.checkListIdx].items[
        idxs.itemIdx
      ].isDone;
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
      console.log(memberId);
      //   console.log(this.board.members);
      var idx = this.board.members.findIndex((member) => member === memberId);
      if (idx === -1) return;
      this.board.members.splice(idx, 1);
      this.updateBoard();
      idx = this.members.findIndex((member) => member._id === memberId);
      this.members.splice(idx, 1);
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
        ghostClass: "ghost"
      };
    }
  },
  components: {
    boardNav,
    taskDetails,
    list,
    draggable,
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