<template>
	<section>
		<h2 contenteditable @blur="updateListName" v-text="listName">{{ list.name }}</h2>
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
					<img class="preview-img" v-if="task.previewImg" :src="task.previewImg" >
					<ul class="flex" v-if="task.members.length">
						<li v-for="memberId in task.members" :key="memberId">
							<img
								class="avatar"
								:src="getMemberImgById(memberId)"
							/>
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
			newTaskTitle: '',
			listName: null
		};
    },
	methods: {
		updateListName(evt){
			var src = evt.target.innerText
            this.listName = src
			this.$emit('updateListName', {
				newName: this.listName,
				listIdx: this.listIdx
			})
		},
        toggleAdd() {
            this.isAddInput = !this.isAddInput;
		},
		getMemberImgById(id) {
			const arr = this.members.filter(member => member._id === id);
			if (!arr.length) return;
			return arr[0].imgUrl;
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
		draggable
	},
	created(){
		this.listName = this.list.name
	}
}
</script>