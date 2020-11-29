<template>
	<section>
		<h2
			class="list-header"
			contenteditable
			@blur="updateListName"
			v-text="listName"
		>
			{{ list.name }}
		</h2>
		<button class="delete-list-btn" @click="removeList(listIdx)"><i class="fas fa-trash"></i></button>
		<ul>
			<draggable :list="list.tasks" group="tasks" :move="tiltCard" v-bind="dragOptions" @sort="emitUpdateList">
				<li
					class="task"
					v-for="(task, taskIdx) in list.tasks"
					:key="taskIdx"
					@click="openTask(listIdx, taskIdx)"
				>
					<h4 class="task-header">{{ task.name }}</h4>
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
							<!-- <img
								class="avatar"
								:src="getMemberImgById(memberId)"
							/> -->
						</li>
					</ul>
					<button @click.stop="removeTask(listIdx, taskIdx)">
						Delete Task
					</button>
				</li>
			</draggable>
		</ul>
		<button v-if="!isAddInput" class="add-task-btn" @click="toggleAdd">
			+ Add task
		</button>
		<add-item-input v-else @add="addTask(listIdx, $event)" />
	</section>
</template>

<script>
import draggable from 'vuedraggable';
import userAvatar from './user-avatar.cmp';
import addItemInput from './add-item-input.cmp';
export default {
	name: 'list',
	props: {
		list: Object,
		listIdx: Number,
		members: Array
	},
	data() {
		return {
			isAddInput: false,
			listName: null
		};
	},
	methods: {
		updateListName(evt) {
			var src = evt.target.innerText;
			this.listName = src;
			this.$emit('updateListName', {
				newName: this.listName,
				listIdx: this.listIdx
			});
		},
		toggleAdd() {
			this.isAddInput = !this.isAddInput;
		},
		getMemberById(id) {
			const arr = this.members.filter(member => member._id === id);
			if (!arr.length) return;
			return arr[0];
		},
		openTask(listIdx, taskIdx) {
			this.$emit('openTask', {
				listIdx,
				taskIdx
			});
		},
		removeTask(listIdx, taskIdx) {
			this.$emit('removeTask', {
				listIdx,
				taskIdx
			});
		},
		addTask(listIdx, itemTxt
		) {
			if (itemTxt === '') {
				this.toggleAdd();
				return;
			}
			this.$emit('addTask', {
				listIdx,
				title: itemTxt
			});
			this.toggleAdd();
		},
		removeList(listIdx) {
			console.log('removeList');
			this.$emit('removeList', listIdx);
		},
		emitUpdateList() {
			this.$emit('updateList', this.list);
		},
		tiltCard(ev) {
			// console.log(ev)
			// console.log(ev.dragged)
			// ev.dragged.classList.add('tilt');
			// ev.item.classList.toggle('tilt');
		}
	},
	computed: {
		dragOptions() {
      return {
        animation: 300,
        group: 'tasks',
        disabled: false,
		ghostClass: 'ghost',
      };
    }
	},
	components: {
		draggable,
		userAvatar,
		addItemInput
	},
	created() {
		this.listName = this.list.name;
	}
}
</script>