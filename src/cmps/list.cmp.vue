<template>
	<section>
		<h2>{{ list.name }}</h2>
		<button @click="removeList(listIdx)">Delete List</button>
		<ul>
			<draggable :list="list.tasks" group="tasks" @sort="emitUpdateList">
				<li
					class="task"
					v-for="(task, taskIdx) in list.tasks"
					:key="taskIdx"
					@click="openTask(listIdx, taskIdx)"
				>
					<p>{{ task.name }}</p>
					<ul class="flex" v-if="task.members.length">
						<li v-for="memberId in task.members" :key="memberId">
							<user-avatar :user="getMemberById(memberId)"></user-avatar>
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
		<form v-else @submit.prevent="addTask(listIdx)">
			<input
                autofocus
				ref="cusomo"
				type="text"
				placeholder="Task Title"
				v-model="newTaskTitle"
			/>
			<button>Add</button>
		</form>
	</section>
</template>

<script>
import draggable from 'vuedraggable';
import userAvatar from './user-avatar.cmp'
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
			newTaskTitle: ''
		};
    },
	methods: {
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
		addTask(listIdx) {
			if (this.newTaskTitle === '') {
                this.toggleAdd();
				return;
			}
			this.$emit('addTask', {
				listIdx,
				title: this.newTaskTitle
			});
            this.newTaskTitle = '';
			this.toggleAdd();
		},
		removeList(listIdx) {
			this.$emit('removeList', listIdx);
        },
        emitUpdateList() {
            this.$emit('updateList', this.list)
        }
	},
	components: {
		draggable,
		userAvatar
	}
}
</script>