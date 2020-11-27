<template>
<section v-if="list">
          <h2>{{ list.name }}</h2>
          <pre>{{list}}</pre>
          <button @click="removeList(listIdx)">Delete List</button>
          <ul>
            <li
              class="task"
              v-for="(task, taskIdx) in list.tasks"
              :key="taskIdx"
              @click="openTask(listIdx, taskIdx)"
            >
              <p>{{ task.name }}</p>
              <ul class="flex" v-if="task.members && task.members.length">
                <li v-for="memberId in task.members" :key="memberId">
                    <img  class="avatar" :src="getMemberImgById(memberId)"/>
                </li>
              </ul>
              <button @click.stop="removeTask(listIdx, taskIdx)">Delete Task</button>
            </li>
          </ul>
          <button v-if="!isAddInput" class="add-task-btn" @click="toggleAdd">+ Add task</button>
          <form v-else @submit.prevent="addTask(listIdx)">
              <input type="text" placeholder="Task Title" v-model="newTaskTitle">
              <button>Add</button>
          </form>
</section>      
</template>

<script>

export default {
    name: 'list',
    props:{
        list: Object,
        listIdx: Number,
        members: Array
    },
	data() {
		return {
            isAddInput: false,
            newTaskTitle: ''
		}
    },
    watch:{
    },
	computed: {},
	methods: {
            toggleAdd(){
            this.isAddInput = !this.isAddInput
        },
            getMemberImgById(id){
            const arr =  this.members.filter(member => member._id === id)
            if(!arr.length) return 
            return arr[0].imgUrl
        },
        openTask(listIdx, taskIdx){
            this.$emit('openTask', {
                listIdx,
                taskIdx
            })
        },
        removeTask(listIdx, taskIdx){
            this.$emit('removeTask', {
                listIdx,
                taskIdx
            })
        },
        addTask(listIdx){
            if(this.newTaskTitle === ''){
                this.toggleAdd()
                return
            }
            this.$emit('addTask', {
                listIdx,
                title: this.newTaskTitle
            })
            this.newTaskTitle = ''
            this.toggleAdd()
        },
        removeList(listIdx){
            this.$emit('removeList', listIdx)
        }
    },
    created(){
        
    }
}
</script>