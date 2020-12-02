<template>
	<li class="list flex-column">
		<div
			@click="closeListEdit"
			:class="{ hide: !isListEdit, 'disable-page-container': isListEdit }"
		></div>
		<div
			class="list-header-container flex justify-space-between align-center"
		>
			<h2
				class="list-header"
				contenteditable
				@blur="updateListName"
				v-text="listName"
				:id="'list' + listIdx"
				ref="header"
			>
				{{ list.name }}
			</h2>
			<button class="list-edit-btn" @click="openListEdit">
				<font-awesome-icon :icon="['fas', 'ellipsis-v']" />
			</button>
			<list-edit-menu
				v-if="isListEdit"
				:listIdx="listIdx"
				@removeList="removeList"
				@toggleAdd="toggleAdd"
			/>
		</div>
		<ul class="draggable-tsaks-container">
			<draggable
				class="draggable-tsaks"
				:list="list.tasks"
				group="tasks"
				v-bind="dragOptions"
				@sort="emitUpdateList"
			>
				<li
					class="task-preview"
					v-for="(task, taskIdx) in list.tasks"
					:key="taskIdx"
					@click="openTask(listIdx, taskIdx)"
					:style="{ backgroundColor: task.backgroundColor }"
				>
					<ul class="task-preview-labels flex">
						<li
							v-for="(label, idx) in task.labels"
							:key="idx"
							class="task-preview-label"
							:style="{
								backgroundColor: label.backgroundColor,
							}"
						></li>
					</ul>
					<div
						class="task-preview-header flex align-center justify-space-between"
					>
						<h4>{{ task.name }}</h4>
					</div>
					<img
						class="preview-img"
						v-if="task.previewImg"
						:src="task.previewImg"
					/>
					<ul class="flex" v-if="task.members.length">
						<li v-for="memberId in task.members" :key="memberId">
							<user-avatar
								:user="getMemberById(memberId)"
							></user-avatar>
						</li>
					</ul>
				</li>
			</draggable>
		</ul>
		<button v-if="!isAddInput" class="add-task-btn" @click="toggleAdd">
			+ Add task
		</button>
		<add-item-input
			class="add-item-input"
			id="add-task-input"
			v-else
			@add="addTask(listIdx, $event)"
		/>
	</li>
</template>

<script>
import draggable from "vuedraggable";
// import { Container, Draggable } from 'vue-smooth-dnd';
import userAvatar from "./user-avatar.cmp";
import addItemInput from "./add-item-input.cmp";
import listEditMenu from "./list-edit-menu.cmp";
export default {
	name: "list",
	props: {
		list: Object,
		listIdx: Number,
		members: Array,
		isNewList: Boolean
	},
	data() {
		return {
			isAddInput: false,
			isListEdit: false,
			listName: null,
			dropPlaceholderOptions: {
				className: 'drop-preview',
				animationDuration: '150',
				showOnTop: true
			}
		};
	},
	methods: {
		openListEdit() {
			this.isListEdit = true;
		},
		closeListEdit() {
			this.isListEdit = false;
		},
		updateListName(evt) {
			var src = evt.target.innerText;
			this.listName = src;
			this.$emit("updateListName", {
				newName: this.listName,
				listIdx: this.listIdx,
			});
		},
		toggleAdd() {
			this.isAddInput = !this.isAddInput;
		},
		getMemberById(id) {
			const arr = this.members.filter((member) => member._id === id);
			if (!arr.length) return;
			return arr[0];
		},
		openTask(listIdx, taskIdx) {
			this.$emit("openTask", {
				listIdx,
				taskIdx,
			});
		},
		addTask(listIdx, itemTxt) {
			if (itemTxt === "") {
				this.toggleAdd();
				return;
			}
			this.$emit("addTask", {
				listIdx,
				title: itemTxt,
			});
			this.toggleAdd();
		},
		removeList(listIdx) {
			this.closeListEdit();
			this.$emit("removeList", listIdx);
		},
		emitUpdateList() {
			this.$emit("updateList", this.list);
		},
	},
	watch: {
		'list.name'() {
			this.listName = this.list.name;
		}
	},
	computed: {
		dragOptions() {
			return {
				animation: 300,
				group: "tasks",
				disabled: false,
				ghostClass: "ghost",
			};
		},
	},
	components: {
		draggable,
		// Container,
		// Draggable,
		userAvatar,
		addItemInput,
		listEditMenu,
	},
	mounted() {
		debugger;
		if (this.isNewList) {
			this.$refs.header.focus();
		}
	},
	created() {
		this.listName = this.list.name;
	},
	destroyed() {
	}
};
</script>