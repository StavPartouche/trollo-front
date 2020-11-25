<template>
  <div class="board-edit">
    <!-- <nav-tools v-model="board"></nav-tools> -->
    <!-- <nav-tools :board="board"></nav-tools> -->
    <div class="lists-container">
      <ul class="list" v-if="board">
        <li class="list-item" v-for="(list, listIdx) in board.lists" :key="list.id">
          <h2>{{list.name}}</h2>
          <ul>
            <li class="task" v-for="(task, taskIdx) in list.tasks" :key="task.id" @click="openTask(listIdx, taskIdx)">
              <p>{{task.name}}</p>
            </li>
          </ul>
          <button @click="addTask(listIdx)">Add task</button>
        </li>
      </ul>
      <button @click="addList">Add list</button>
    </div>
    <task-details v-if="currTask" :task="currTask"/>
  </div>
</template>

<script>

  import { boardService } from '../services/board.service.js'
  import { userService } from '../services/user.service.js'
  import navTools from '../cmps/nav-tools.cmp'
  import taskDetails from '../cmps/task-details.cmp'

export default {
  name: 'board-edit',
  data(){
    return{
      board: null,
      members:[],
      currTask: null
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
    openTask(listIdx, taskIdx){
      // this.currTask = this.board
      console.log(listIdx, taskIdx);
    },
    addTask(ListIdx){
      var newTask = boardService.getEmptyTask()
      newTask.name = prompt('Enter Task name')
      this.board.lists[ListIdx].tasks.push(newTask)
      this.$store.dispatch({
                type: 'saveBoard',
                board: this.board
      })
    },
    async getMember(memberId){
      const member = await userService.getById(memberId)
      return member
    }
  },
  components:{
    navTools,
    taskDetails
  },
  async created(){
    const boardId = this.$route.params.id
    const board = await boardService.getById(boardId)
    board.members.forEach( async (member) => {
        var memberObject = await this.getMember(member)
        this.members.push(memberObject)
    });
    this.board = JSON.parse(JSON.stringify(board))
  }
}
</script>