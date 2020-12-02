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
      <div v-if="currTask"
      @click="closeDetails"
      class="disable-page-container"
    ></div>
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
			@addTask="addTask"
		/>
	</div>
</template>

<script>
import { boardService } from "../services/board.service.js";
import { userService } from "../services/user.service.js";
import { eventBusService } from "../services/eventBus.service.js";
import { utilService } from '../services/util.service.js'
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
			isSocketEv: false,
		};
	},
	methods: {
		// BOARD-NAV
		toggleMenu(ev) {
			this.isMenu = ev;
		},
		updateBoardName(name) {
			this.board.name = name;
			const activity = boardService.newActivity(
				`updated board name to "${name}"`,
				this.userId
			);
			this.board.activities.unshift(activity);
			socket.emit('boardName', name);
		},
		async removeBoardMember(memberId) {
			const fullMember = await this.getMember(memberId);
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
			const boardId = this.board._id;
			await this.$store.dispatch({
				type: "removeBoard",
				boardId
			});
			socket.emit('removeBoard', boardId);
			this.$router.push("/board");
		},
		updateBoardDesc(desc) {
			this.board.description = desc;
			const activity = boardService.newActivity(
				`updated board description`,
				this.userId
			);
			this.board.activities.unshift(activity);
			socket.emit('boardDesc', desc);
		},
		updateBoardDueDate(dueDate) {
			this.board.dueDate = dueDate;
			const activity = boardService.newActivity(
				`updated board due date to ${dueDate}`,
				this.userId
			);
			this.board.activities.unshift(activity);
			// Need to add socket handle
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
			socket.emit('boardStyle', this.board.style);
		},

		// LIST
		removeList(listIdx) {
			const activity = boardService.newActivity(
				`removed list "${this.board.lists[listIdx].name}"`,
				this.userId
			);
			this.board.activities.unshift(activity);
			this.board.lists.splice(listIdx, 1);
			socket.emit('removeList', listIdx);
		},
		openTask(idxs) {
			this.currTask = this.board.lists[idxs.listIdx].tasks[idxs.taskIdx];
			this.currListIdx = idxs.listIdx;
			this.currTaskIdx = idxs.taskIdx;
		},
		addTask(updates) {
			var newTask = null
			var activity = null
			if(updates.id){
				newTask = JSON.parse(JSON.stringify(updates))
				newTask.id = utilService.makeId()
				this.board.lists[this.currListIdx].tasks.push(newTask)
				activity = boardService.newActivity(
					`added a copy of task "${newTask.name}"`,
					this.userId,
					newTask.id
				);
				this.board.activities.unshift(activity);
				socket.emit('addTask', {
					listIdx: this.currListIdx,
					task: newTask
				});
			} 
			else{
				newTask = boardService.getEmptyTask();
				newTask.name = updates.title;
				this.board.lists[updates.listIdx].tasks.push(newTask);
				activity = boardService.newActivity(
					`added a new task "${newTask.name}"`,
					this.userId,
					newTask.id
				);
				this.board.activities.unshift(activity);
				socket.emit('addTask', {
					listIdx: updates.listIdx,
					task: newTask
				});
			}
		},
		updateListName(updates) {
			this.board.lists[updates.listIdx].name = updates.newName;
			const activity = boardService.newActivity(
				`updated list name to "${updates.newName}"`,
				this.userId
			);
			this.board.activities.unshift(activity);
			socket.emit('listName', {
				listIdx: updates.listIdx,
				name: updates.newName
			});
		},

		// TASK-DETAILS
		closeDetails() {
			this.currTask = null;
		},
		toggleCheck(idxs) {
			const currItem = this.currTask.checkLists[idxs.checkListIdx].items[
				idxs.itemIdx];
			currItem.isDone = !currItem.isDone;
			socket.emit('checkListItem', {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				checkListIdx: idxs.checkListIdx,
				itemIdx: idxs.itemIdx,
				item: currItem
			});
		},
		addItem(item) {
			const currCheckListItems = this.currTask.checkLists[item.checkListIdx].items;
			const newItem = {
				txt: item.txt,
				isDone: item.isDone,
			};
			currCheckListItems.push(newItem);
			socket.emit('checkListItem', {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				checkListIdx: item.checkListIdx,
				item: newItem
			});
		},
		removeItem(idxs) {
			this.currTask.checkLists[idxs.checkListIdx].items.splice(idxs.itemIdx, 1);
			socket.emit('checkListItem', {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				checkListIdx: idxs.checkListIdx,
				itemIdx: idxs.itemIdx
			});
		},
		addCheckList(checkListData) {
			const currCheckLists = this.currTask.checkLists;
			const newCheckList = {
				title: checkListData.title,
				items: checkListData.items,
			};
			currCheckLists.push(newCheckList);
			const activity = boardService.newActivity(
				`added checklist "${checkListData.title}" to ${this.currTask.name}`,
				this.userId,
				this.currTask.id
			);
			this.board.activities.unshift(activity);
			socket.emit('checkList', {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				checkList: newCheckList
			});
		},
		removeCheckList(idx) {
			const activity = boardService.newActivity(
				`removed checklist "${this.currTask.checkLists[idx].title}" from ${this.currTask.name}`,
				this.userId,
				this.currTask.id
			);
			this.board.activities.unshift(activity);
			this.currTask.checkLists.splice(idx, 1);
			socket.emit('checkList', {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				checkListIdx: idx
			});
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
			socket.emit('taskMember', {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				memberId
			});
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
			socket.emit('taskMember', {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				memberIdx
			});
		},
		updateDueDate(newDate) {
			this.currTask.dueDate = newDate;
			const activity = boardService.newActivity(
				`updated due date in ${this.currTask.name} to ${newDate}`,
				this.userId,
				this.currTask.id
			);
			this.board.activities.unshift(activity);
			socket.emit('taskDueDate', {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				dueDate: newDate
			});
		},
		updateTaskName(newName) {
			this.currTask.name = newName;
			const activity = boardService.newActivity(
				`updated task name to ${newName}`,
				this.userId,
				this.currTask.id
			);
			this.board.activities.unshift(activity);
			socket.emit('taskName', {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				name: newName
			});
		},
		updateTaskDesc(newDesc) {
			this.currTask.description = newDesc;
			const activity = boardService.newActivity(
				`updated ${this.currTask.name}s description`,
				this.userId,
				this.currTask.id
			);
			this.board.activities.unshift(activity);
			socket.emit('taskDesc', {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				desc: newDesc
			});
		},
		UploadImg(imgUrl) {
			this.currTask.attachments.push(imgUrl);
			const activity = boardService.newActivity(
				`added an attachment to ${this.currTask.name}`,
				this.userId,
				this.currTask.id
			);
			this.board.activities.unshift(activity);
			socket.emit('uploadImg', {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				imgUrl
			});
		},
		removeAttachment(idx) {
			this.currTask.attachments.splice(idx, 1);
			const activity = boardService.newActivity(
				`removed an attachment from ${this.currTask.name}`,
				this.userId,
				this.currTask.id
			);
			this.board.activities.unshift(activity);
			socket.emit('attachment', {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				attachmentIdx: idx
			});
		},
		setPreviewImg(idx) {
			this.currTask.previewImg = this.currTask.attachments[idx];
			socket.emit('previewImg', {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				previewImg: this.currTask.attachments[idx]
			});
		},
		removePreviewImg() {
			this.currTask.previewImg = "";
			socket.emit('previewImg', {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				previewImg: ''
			});
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
			socket.emit('comment', {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				comment
			});
		},
		toggleLabel(label) {
			const idx = this.currTask.labels.findIndex(
				(currLabel) => currLabel.backgroundColor === label.backgroundColor
			);
			if (idx === -1) this.currTask.labels.push(label);
			else this.currTask.labels.splice(idx, 1);
			socket.emit('label', {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				labelIdx: idx,
				label
			});
		},
		setTaskColor(bgc) {
			this.currTask.backgroundColor = bgc;
			const activity = boardService.newActivity(
				`updated ${this.currTask.name} color`,
				this.userId,
				this.currTask.id
			);
			this.board.activities.unshift(activity);
			socket.emit('taskColor', {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				bgc
			});
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
			socket.emit('removeTask', {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
			});
		},

		// GENERAL BOARD
		async addList() {
			var newList = boardService.getEmptyList("Enter list name");
			this.isNewList = true;
			this.board.lists.push(newList);
			const activity = boardService.newActivity(
				`added a list`,
				this.userId
			);
			this.board.activities.unshift(activity);
			this.isNewList = false;
			socket.emit('addList', newList);
		},
		async getMember(memberId) {
			const member = await userService.getById(memberId);
			return member;
		},
		async loadBoard(ev) {
			// const updatedBoard = await boardService.getById(this.board._id);
			// this.board = updatedBoard;
			// await eventBusService.$emit("boardBgc", this.board.style);
			// this.members = [];
			// this.board.members.forEach(async (member) => {
			// 	var memberObject = await this.getMember(member);
			// 	this.members.push(memberObject);
			// });
			// if (this.currTask)
			// 	this.currTask = this.board.lists[this.currListIdx].tasks[
			// 		this.currTaskIdx
			// 	];
		},
		onDrag() {
		},

		// Socket Events
		socketEv({ type, data }) {
			if (type === 'boardName') this.board.name = data;
			if (type === 'removeBoardMember') this.removeBoardMember(data);
			if (type === 'addBoardMember') this.addBoardMember(data);
			if (type === 'boardDesc') this.board.description = data;
			if (type === 'boardStyle') eventBusService.$emit("boardBgc", data);
			if (type === 'removeList') this.board.lists.splice(data, 1);
			if (type === 'addList') {
				this.isNewList = true;
				this.board.lists.push(data);
				this.isNewList = false;
			};
			if (type === 'listName') this.board.lists[data.listIdx].name = data.name;;
			if (type === 'checkListItem') {
				const currList = this.board.lists[data.listIdx];
				const currTask = currList.tasks[data.taskIdx];
				const currCheckList = currTask.checkLists[data.checkListIdx];
				if (!data.itemIdx && data.itemIdx !== 0) currCheckList.items.push(data.item);
				else if (!data.item) currCheckList.items.splice(data.itemIdx, 1);
				else currCheckList.items.splice(data.itemIdx, 1, data.item);
			}
			if (type === 'checkList') {
				const currList = this.board.lists[data.listIdx];
				const currTask = currList.tasks[data.taskIdx];
				if (data.checkListIdx >= 0) currTask.checkLists.splice(data.checkListIdx, 1);
				else currTask.checkLists.push(data.checkList);
			}
			if (type === 'addTask') this.board.lists[data.listIdx].tasks.push(data.task);
			if (type === 'removeTask') this.board.lists[data.listIdx].tasks.splice(data.taskIdx, 1);
			if (type === 'taskMember') {
				const currList = this.board.lists[data.listIdx];
				const currTask = currList.tasks[data.taskIdx];
				if (data.memberIdx >= 0) currTask.members.splice(data.memberIdx, 1);
				else currTask.members.push(data.memberId);
			}
			if (type === 'taskDueDate') {
				const currList = this.board.lists[data.listIdx];
				const currTask = currList.tasks[data.taskIdx];
				currTask.dueDate = data.dueDate;
			}
			if (type === 'taskName') {
				const currList = this.board.lists[data.listIdx];
				const currTask = currList.tasks[data.taskIdx];
				currTask.name = data.name;
			}
			if (type === 'taskDesc') {
				const currList = this.board.lists[data.listIdx];
				const currTask = currList.tasks[data.taskIdx];
				currTask.description = data.desc;
			}
			if (type === 'uploadImg') {
				const currList = this.board.lists[data.listIdx];
				const currTask = currList.tasks[data.taskIdx];
				currTask.attachments.push(data.imgUrl);
			}
			if (type === 'attachment') {
				const currList = this.board.lists[data.listIdx];
				const currTask = currList.tasks[data.taskIdx];
				if (data.attachmentIdx >= 0) currTask.attachments.splice(data.attachmentIdx, 1);
			}
			if (type === 'previewImg') {
				const currList = this.board.lists[data.listIdx];
				const currTask = currList.tasks[data.taskIdx];
				currTask.previewImg = data.previewImg;
			}
			if (type === 'comment') {
				const currList = this.board.lists[data.listIdx];
				const currTask = currList.tasks[data.taskIdx];
				currTask.comments.push(data.comment);
			}
			if (type === 'label') {
				const currList = this.board.lists[data.listIdx];
				const currTask = currList.tasks[data.taskIdx];
				if (data.labelIdx === -1) currTask.labels.push(data.label);
				else currTask.labels.splice(data.labelIdx, 1);
			}
			if (type === 'taskColor') {
				const currList = this.board.lists[data.listIdx];
				const currTask = currList.tasks[data.taskIdx];
				currTask.backgroundColor = data.bgc;
			}
		}
	},
	watch: {
		board: {
			handler: function (newBoard) {
				// if (this.isSocketEv) return;
				this.$store.dispatch({
					type: "saveBoard",
					board: newBoard
				});
			},
			deep: true
		},
		'board.activities'(activities) {
			socket.emit('activity', activities[0]);
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

		// this.onDrag = _.debounce(this.onDrag, 500);
		board.members.forEach(async (member) => {
			var memberObject = await this.getMember(member);
			this.members.push(memberObject);
		});
		this.board = JSON.parse(JSON.stringify(board));
		eventBusService.$emit("boardBgc", this.board.style);
		// this.currTask = this.board.lists[0].tasks[0]

		// Sockets
		socket.setup();
		socket.on('boardName', this.socketEv);
		socket.on('removeBoardMember', this.socketEv);
		socket.on('addBoardMember', this.socketEv);
		socket.on('boardDesc', this.socketEv);
		socket.on('boardStyle', this.socketEv);
		socket.on('removeList', this.socketEv);
		socket.on('addList', this.socketEv);
		socket.on('listName', this.socketEv);
		socket.on('checkListItem', this.socketEv);
		socket.on('checkList', this.socketEv);
		socket.on('addTask', this.socketEv);
		socket.on('removeTask', this.socketEv);
		socket.on('taskMember', this.socketEv);
		socket.on('taskDueDate', this.socketEv);
		socket.on('taskName', this.socketEv);
		socket.on('taskDesc', this.socketEv);
		socket.on('uploadImg', this.socketEv);
		socket.on('attachment', this.socketEv);
		socket.on('previewImg', this.socketEv);
		socket.on('comment', this.socketEv);
		socket.on('label', this.socketEv);
		socket.on('taskColor', this.socketEv);
		// socket.on('activity', activity => {
		//   this.isSocketEv = true;
		//   this.board.activities.unshift(activity)
		//   this.isSocketEv = false;
		// });
		// socket.on("updateBoard", this.loadBoard);
		socket.emit('enterBoard', boardId);
	},
	destroyed() {
		socket.emit("leaveBoard");
		socket.off('boardName', this.socketEv);
		socket.off('removeBoardMember', this.socketEv);
		socket.off('addBoardMember', this.socketEv);
		socket.off('boardDesc', this.socketEv);
		socket.off('boardStyle', this.socketEv);
		socket.off('removeList', this.socketEv);
		socket.off('addList', this.socketEv);
		socket.off('addTask', this.socketEv);
		socket.off('removeTask', this.socketEv);
		socket.off('listName', this.socketEv);
		socket.off('checkListItem', this.socketEv);
		socket.off('checkList', this.socketEv);
		socket.off('addTask', this.socketEv);
		socket.off('taskMember', this.socketEv);
		socket.off('taskDueDate', this.socketEv);
		socket.off('taskName', this.socketEv);
		socket.off('taskDesc', this.socketEv);
		socket.off('uploadImg', this.socketEv);
		socket.off('attachment', this.socketEv);
		socket.off('previewImg', this.socketEv);
		socket.off('comment', this.socketEv);
		socket.off('label', this.socketEv);
		socket.off('taskColor', this.socketEv);
		// socket.off('activity', activity => this.board.activities.unshift(activity));
		// socket.off("updateBoard", this.loadBoard);
		socket.terminate();
	},
};
</script>