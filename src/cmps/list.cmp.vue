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
				@mousedown="toggleIsDrag"
				@mouseup="toggleIsDrag"
				@blur="updateListName"
				v-text="listName"
				:id="'list' + listIdx"
				ref="header"
			>
				{{ list.name }}
			</h2>
			<button class="list-edit-btn" @click="openListEdit">
				<font-awesome-icon :icon="['fas', 'ellipsis-h']" />
			</button>
			<list-edit-menu
				v-if="isListEdit"
				:listIdx="listIdx"
				@removeList="removeList"
				@toggleAdd="toggleAdd"
			/>
		</div>
		<ul class="draggable-tasks-container">
			<Container
				orientation="vertical"
				drag-handle-selector=".task-preview"
				non-drag-area-selector="img"
				@drop="onDrop(list.id, $event)"
				@drag-start="onDragStart"
				@drag-end="onDragEnd"
				:get-child-payload="getChildPayload"
				group-name="tasks"
				drag-class="card-ghost"
				drop-class="card-ghost-drop"
			>
				<Draggable
					class="draggable-tasks"
					v-for="task in list.tasks"
					:key="task.id"
				>
					<li
						class="task-preview"
						@click="openTask(list.id, task.id)"
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
						<taskPreviewFotter :task="task" :members="members" />
					</li>
				</Draggable>
			</Container>
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
import { Container, Draggable } from 'vue-smooth-dnd';
import addItemInput from "./add-item-input.cmp";
import listEditMenu from "./list-edit-menu.cmp";
import taskPreviewFotter from './task-preview-footer.cmp';
export default {
	name: "list",
	props: {
		list: Object,
		listIdx: Number,
		members: Array,
		isNewList: Boolean,
	},
	data() {
		return {
			isAddInput: false,
			isListEdit: false,
			listName: null,
			isDrag: false,
			dropPlaceholderOptions: {
				className: 'drop-preview',
				animationDuration: '150',
				showOnTop: true
			},
			'--rotate': 'rotateZ(0deg)',
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
			if (this.isDrag) return;
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
		openTask(listId, taskId) {
			this.$emit("openTask", {
				listId,
				taskId
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
		toggleIsDrag() {
			this.isDrag = !this.isDrag;
		},
		onDrop(listId, dropResult) {
			this.$emit('drop', { listId, dropResult });
		},
		getChildPayload(taskIdx) {
			return this.list.tasks[taskIdx];
		},
		onDragStart(ev) {
			if (!ev.isSource) return;
			document.documentElement.addEventListener('mousemove', this.mouseMove);
		},
		onDragEnd(ev) {
			document.documentElement.removeEventListener('mousemove', this.mouseMove);
			document.documentElement.style.setProperty('--rotate', '0deg')
		},
		mouseMove(ev) {
			const rotate = (ev.movementX > 0) ? '7deg' : '-7deg';
			document.documentElement.style.setProperty('--rotate', rotate)
		}
	},
	watch: {
		'list.name'() {
			this.listName = this.list.name;
		}
	},
	components: {
		Container,
		Draggable,
		addItemInput,
		listEditMenu,
		taskPreviewFotter
	},
	mounted() {
		if (this.isNewList) this.$refs.header.focus();
	},
	created() {
		this.listName = this.list.name;
	},
	destroyed() {
	}
};
</script>