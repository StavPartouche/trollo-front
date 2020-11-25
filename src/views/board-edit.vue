<template>
  <div class="board-edit">
    <ul class="list" v-if="board">
      <li class="list-item" v-for="(list, idx) in board.lists" :key="list.id">
        <h2>{{list.name}}</h2>
        <ul>
          <li class="task" v-for="task in list.tasks" :key="task.id">
            <p>{{task.name}}</p>
          </li>
        </ul>
        <button @click="addTask(idx)">Add task</button>
      </li>
    </ul>
    <button @click="addList">Add list</button>
  </div>
</template>

<script>

  import { boardService } from '../services/board.service.js'

export default {
  name: 'board-edit',
  data(){
    return{
      board: null
    }
  },
  methods:{
    addList(){
      var newList = boardService.getEmptyList()
      newList.name = prompt('Enter List name')
      this.board.lists.push(newList)
      this.$store.dispatch({
                type: 'saveBoard',
                board: this.board
      })
    },
    addTask(ListIdx){
      var newTask = boardService.getEmptyTask()
      newTask.name = prompt('Enter Task name')
      this.board.lists[ListIdx].tasks.push(newTask)
      this.$store.dispatch({
                type: 'saveBoard',
                board: this.board
      })
    }
  },
  async created(){
    const boardId = this.$route.params.id
    const board = await boardService.getById(boardId)
    this.board = JSON.parse(JSON.stringify(board))
  }
}
</script>