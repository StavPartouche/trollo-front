<template>
	<div class="board-edit flex-column">
		<board-nav
			@toggleMenu="toggleMenu"
			@filter="setFilterBy"
			@search="setSearch"
			@updateBoardName="updateBoardName"
			@removeBoardMember="updateBoardMember('remove', $event)"
			@addBoardMember="updateBoardMember('add', $event)"
			v-if="board"
			:name="board.name"
			:members="members"
			:board="board"
		></board-nav>
		<board-menu
			v-if="menu"
			@removeBoard="removeBoard"
			@saveBoardBgc="saveBoardBgc"
			@updateBoardName="updateBoardName"
			@updateBoardDesc="updateBoardDesc"
			@updateBoardDueDate="updateBoardDueDate"
			:menu="menu"
			:name="board.name"
			:description="board.description"
			:dueDate="board.dueDate"
			:activities="board.activities"
		></board-menu>
		<ul class="lists" v-if="board">
			<Container
				orientation="horizontal"
				drag-handle-selector=".list"
				:get-child-payload="getChildPayload"
				@drop="onListDrag"
				group-name="lists"
			>
				<Draggable v-for="(list, listIdx) in lists" :key="list.id">
					<list
						:list="list"
						:listIdx="listIdx"
						:members="members"
						:isNewList="isNewList"
						@removeList="removeList"
						@openTask="openTask"
						@addTask="addTask"
						@drop="onTaskDrag"
						@updateListName="updateListName"
					/>
				</Draggable>
			</Container>
			<li>
				<button class="add-list-btn" @click="addList">
					<i class="fas fa-plus"></i><span>Add list</span>
				</button>
			</li>
		</ul>
		<div
			v-if="currTask"
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
import { utilService } from "../services/util.service.js";
import boardNav from "../cmps/board-nav/board-nav.cmp";
import boardMenu from "../cmps/board-menu/board-menu.cmp";
import taskDetails from "../cmps/task-details/task-details.cmp";
import list from "../cmps/list.cmp";
import { Container, Draggable } from "vue-smooth-dnd";
import socket from "@/services/socket.service";
import io from "socket.io-client";
import _ from "lodash";

export default {
	name: "board-edit",
	data() {
		return {
			board: null,
			members: [],
			filterByMemberId: '',
			searchTask: '',
			currTask: null,
			currListIdx: null,
			currTaskIdx: null,
			menu: null,
			isNewList: false,
			isSocketEv: false,
			boardEditEvs: ['boardName', 'removeBoardMember', 'addBoardMember', 'boardDesc', 'boardStyle', 'dragInBoard', 'removeList', 'addList',
				'listName', 'checkListItem', 'checkList', 'addTask', 'removeTask', 'taskMember', 'taskDueDate', 'taskName', 'taskDesc', 'uploadImg',
				'attachment', 'previewImg', 'comment', 'label', 'taskColor', 'log'],
		};
	},
	methods: {
		// BOARD-NAV
		toggleMenu(ev) {
			this.menu = ev;
		},
		updateBoardName(name) {
			this.board.name = name;
			const activity = boardService.newActivity(
				`updated board name to "${name}"`,
				this.userId
			);
			this.board.activities.unshift(activity);
			socket.emit('boardName', name);
			socket.emit('log', activity);
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
				boardId,
			});
			socket.emit("removeBoard");
			this.$router.push("/board");
		},
		updateBoardDesc(desc) {
			this.board.description = desc;
			console.log(this.board.description);
			const activity = boardService.newActivity(
				`updated board description`,
				this.userId
			);
			console.log("updat board desc");
			this.board.activities.unshift(activity);
			socket.emit("boardDesc", desc);
			socket.emit("log", activity);
		},
		updateBoardDueDate(dueDate) {
			this.board.dueDate = dueDate;
			const activity = boardService.newActivity(
				`updated board due date to ${dueDate}`,
				this.userId
			);
			this.board.activities.unshift(activity);
			socket.emit("log", activity);
		},
		saveBoardBgc(bgc) {
			if (bgc.type === "img") {
				this.board.style.url = bgc.img;
			} else {
				this.board.style.url = "color";
				this.board.style.backgroundColor = bgc.color;
			}
			console.log("saveBoardBgc");
			eventBusService.$emit("boardBgc", this.board.style);
			const activity = boardService.newActivity(
				`updated board background`,
				this.userId
			);
			this.board.activities.unshift(activity);
			socket.emit("boardStyle", this.board.style);
			socket.emit("log", activity);
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
			socket.emit('log', activity);
		},
		openTask(idxs) {
			this.currListIdx = this.board.lists.findIndex(list => list.id === idxs.listId);
			this.currTaskIdx = this.board.lists[this.currListIdx].tasks.findIndex(task => task.id === idxs.taskId);
			this.currTask = this.board.lists[this.currListIdx].tasks[this.currTaskIdx];
		},
		addTask(updates) {
			var newTask = null;
			var activity = null;
			if (updates.id) {
				newTask = JSON.parse(JSON.stringify(updates));
				newTask.id = utilService.makeId();
				this.board.lists[this.currListIdx].tasks.push(newTask);
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
				socket.emit('log', activity);
				this.successMsg('Task was duplicated!');
			}
			else {
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
				socket.emit('log', activity);
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
			socket.emit('log', activity);
		},

		// TASK-DETAILS
		closeDetails() {
			this.currTask = null;
		},
		toggleCheck(idxs) {
			const currItem = this.currTask.checkLists[idxs.checkListIdx].items[
				idxs.itemIdx
			];
			currItem.isDone = !currItem.isDone;
			socket.emit("checkListItem", {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				checkListIdx: idxs.checkListIdx,
				itemIdx: idxs.itemIdx,
				item: currItem,
			});
		},
		addItem(item) {
			const currCheckListItems = this.currTask.checkLists[item.checkListIdx]
				.items;
			const newItem = {
				txt: item.txt,
				isDone: item.isDone,
			};
			currCheckListItems.push(newItem);
			socket.emit("checkListItem", {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				checkListIdx: item.checkListIdx,
				item: newItem,
			});
		},
		removeItem(idxs) {
			this.currTask.checkLists[idxs.checkListIdx].items.splice(idxs.itemIdx, 1);
			socket.emit("checkListItem", {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				checkListIdx: idxs.checkListIdx,
				itemIdx: idxs.itemIdx,
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
			socket.emit("checkList", {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				checkList: newCheckList,
			});
			socket.emit("log", activity);
		},
		removeCheckList(idx) {
			const activity = boardService.newActivity(
				`removed checklist "${this.currTask.checkLists[idx].title}" from ${this.currTask.name}`,
				this.userId,
				this.currTask.id
			);
			this.board.activities.unshift(activity);
			this.currTask.checkLists.splice(idx, 1);
			socket.emit("checkList", {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				checkListIdx: idx,
			});
			socket.emit("log", activity);
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
			socket.emit("taskMember", {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				memberId,
			});
			socket.emit("log", activity);
		},
		async removeMemberfromTask(memberId) {
			const memberIdx = this.currTask.members.findIndex(
				(currMemberId) => currMemberId === memberId
			);
			const fullMember = await this.getMember(this.currTask.members[memberIdx]);
			const activity = boardService.newActivity(
				`removed ${fullMember.fullName} from ${this.currTask.name}`,
				this.userId,
				this.currTask.id
			);
			this.board.activities.unshift(activity);
			this.currTask.members.splice(memberIdx, 1);
			socket.emit("taskMember", {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				memberIdx,
			});
			socket.emit("log", activity);
		},
		updateDueDate(newDate) {
			this.currTask.dueDate = newDate;
			const activity = boardService.newActivity(
				`updated due date in ${this.currTask.name} to ${newDate}`,
				this.userId,
				this.currTask.id
			);
			this.board.activities.unshift(activity);
			socket.emit("taskDueDate", {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				dueDate: newDate,
			});
			socket.emit("log", activity);
		},
		updateTaskName(newName) {
			this.currTask.name = newName;
			const activity = boardService.newActivity(
				`updated task name to ${newName}`,
				this.userId,
				this.currTask.id
			);
			this.board.activities.unshift(activity);
			socket.emit("taskName", {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				name: newName,
			});
			socket.emit("log", activity);
		},
		updateTaskDesc(newDesc) {
			this.currTask.description = newDesc;
			const activity = boardService.newActivity(
				`updated ${this.currTask.name}s description`,
				this.userId,
				this.currTask.id
			);
			this.board.activities.unshift(activity);
			socket.emit("taskDesc", {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				desc: newDesc,
			});
			socket.emit("log", activity);
		},
		UploadImg(imgUrl) {
			this.currTask.attachments.push(imgUrl);
			const activity = boardService.newActivity(
				`added an attachment to ${this.currTask.name}`,
				this.userId,
				this.currTask.id
			);
			this.board.activities.unshift(activity);
			socket.emit("uploadImg", {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				imgUrl,
			});
			socket.emit("log", activity);
		},
		removeAttachment(idx) {
			this.currTask.attachments.splice(idx, 1);
			const activity = boardService.newActivity(
				`removed an attachment from ${this.currTask.name}`,
				this.userId,
				this.currTask.id
			);
			this.board.activities.unshift(activity);
			socket.emit("attachment", {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				attachmentIdx: idx,
			});
			socket.emit("log", activity);
		},
		setPreviewImg(idx) {
			this.currTask.previewImg = this.currTask.attachments[idx];
			socket.emit("previewImg", {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				previewImg: this.currTask.attachments[idx],
			});
		},
		removePreviewImg() {
			this.currTask.previewImg = "";
			socket.emit("previewImg", {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				previewImg: "",
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
			socket.emit("comment", {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				comment,
			});
		},
		toggleLabel(label) {
			const idx = this.currTask.labels.findIndex(
				(currLabel) => currLabel.backgroundColor === label.backgroundColor
			);
			if (idx === -1) this.currTask.labels.push(label);
			else this.currTask.labels.splice(idx, 1);
			socket.emit("label", {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				labelIdx: idx,
				label,
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
			socket.emit("taskColor", {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
				bgc,
			});
			socket.emit("log", activity);
		},
		removeTask() {
			const activity = boardService.newActivity(
				`removed ${this.currTask.name} from ${this.board.lists[this.currListIdx].name
				}`,
				this.userId,
				this.currTask.id
			);
			this.board.activities.unshift(activity);
			this.board.lists[this.currListIdx].tasks.splice(this.currTaskIdx, 1);
			this.currTask = null;
			socket.emit("removeTask", {
				listIdx: this.currListIdx,
				taskIdx: this.currTaskIdx,
			});
			socket.emit("log", activity);
		},

		// GENERAL BOARD
		successMsg(msg) {
			this.$message({
				message: msg,
				type: 'success'
			});
		},
		async addList() {
			var newList = boardService.getEmptyList("Enter list name");
			this.isNewList = true;
			await this.board.lists.push(newList);
			this.isNewList = false;
			const activity = boardService.newActivity(
				`added a list`,
				this.userId
			);
			this.board.activities.unshift(activity);
			socket.emit('addList', newList);
			socket.emit('log', activity);
		},
		async getMember(memberId) {
			const member = await userService.getById(memberId);
			return member;
		},
		getChildPayload(listIdx) {
			return this.board.lists[listIdx];
		},
		onListDrag(dropResult) {
			const board = Object.assign({}, this.board);
			board.lists = utilService.applyDrag(board.lists, dropResult);
			this.board = board;
			socket.emit('dragInBoard', this.board.lists);
		},
		onTaskDrag({ listId, dropResult }) {
			if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
				const board = Object.assign({}, this.board);
				const list = board.lists.filter(list => list.id === listId)[0];
				const listIdx = board.lists.indexOf(list);
				const newList = Object.assign({}, list);
				newList.tasks = utilService.applyDrag(newList.tasks, dropResult);
				board.lists.splice(listIdx, 1, newList);
				this.board = board;
				socket.emit('dragInBoard', this.board.lists);
			}
		},
		setFilterBy(memberId) {
			this.filterByMemberId = memberId;
		},
		setSearch(txt) {
			this.searchTask = txt;
		},

		// Socket Events
		socketEv({ type, data }) {
			if (type === "boardName") this.board.name = data;
			if (type === "removeBoardMember") this.removeBoardMember(data);
			if (type === "addBoardMember") this.addBoardMember(data);
			if (type === "boardDesc") this.board.description = data;
			if (type === "boardStyle") eventBusService.$emit("boardBgc", data);
			if (type === "dragInBoard") this.board.lists = data;
			if (type === "removeList") this.board.lists.splice(data, 1);
			if (type === "addList") this.board.lists.push(data);
			if (type === "listName") this.board.lists[data.listIdx].name = data.name;

			const currList =
				data.listIdx >= 0 ? this.board.lists[data.listIdx] : null;
			const currTask = data.taskIdx >= 0 ? currList.tasks[data.taskIdx] : null;

			if (type === 'addTask') this.board.lists[data.listIdx].tasks.push(data.task);
			if (type === 'removeTask') this.board.lists[data.listIdx].tasks.splice(data.taskIdx, 1);
			if (type === 'taskDueDate') currTask.dueDate = data.dueDate;
			if (type === 'taskName') currTask.name = data.name;
			if (type === 'taskDesc') currTask.description = data.desc;
			if (type === 'uploadImg') currTask.attachments.push(data.imgUrl);
			if (type === 'attachment' && data.attachmentIdx >= 0) currTask.attachments.splice(data.attachmentIdx, 1);
			if (type === 'previewImg') currTask.previewImg = data.previewImg;
			if (type === 'comment') currTask.comments.push(data.comment);
			if (type === 'taskColor') currTask.backgroundColor = data.bgc;
			if (type === 'log') this.board.activities.unshift(data);
			if (type === 'checkList') {
				if (data.checkListIdx >= 0) currTask.checkLists.splice(data.checkListIdx, 1);
				else currTask.checkLists.push(data.checkList);
			}
			if (type === 'taskMember') {
				if (data.memberIdx >= 0) currTask.members.splice(data.memberIdx, 1);
				else currTask.members.push(data.memberId);
			}
			if (type === 'label') {
				if (data.labelIdx === -1) currTask.labels.push(data.label);
				else currTask.labels.splice(data.labelIdx, 1);
			}
			if (type === 'checkListItem') {
				const currCheckList = currTask.checkLists[data.checkListIdx];
				if (data.itemIdx >= 0 && data.item) currCheckList.items.splice(data.itemIdx, 1, data.item);
				else if (!data.item) currCheckList.items.splice(data.itemIdx, 1);
				else currCheckList.items.push(data.item);
			}
		}
	},
	watch: {
		board: {
			handler: function (newBoard) {
				this.$store.dispatch({
					type: 'saveBoard',
					board: newBoard
				});
			},
			deep: true
		}
	},
	computed: {
		lists() {
			const [filter, search] = [this.filterByMemberId, this.searchTask];
			if (!filter && !search) return this.board.lists;
			return this.board.lists.reduce((lists, list) => {
				const listCopy = Object.assign({}, list);
				const filterRes = listCopy.tasks.filter(task => task.members.includes(filter));
				const searchRes = listCopy.tasks.filter(task => task.name.toLowerCase().includes(search.toLowerCase()));
				if (filter && search) {
          const set = new Set(filterRes, searchRes);
					listCopy.tasks = [...set];
        }
				else if (filter && !search) listCopy.tasks = filterRes;
				else listCopy.tasks = searchRes;
				if (listCopy.tasks.length) lists.push(listCopy);
				return lists;
			}, []);
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
		Container,
		Draggable,
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
		socket.setup();
		this.boardEditEvs.forEach(ev => socket.on(ev, this.socketEv));
		socket.emit('enterBoard', boardId);
	},
	destroyed() {
		this.boardEditEvs.forEach(ev => socket.off(ev, this.socketEv));
		socket.emit("leaveBoard");
		socket.terminate();
	},
};
</script>