<template>
  <div class="board-edit">
    <!-- <nav-tools v-model="board"></nav-tools> -->
    <nav-tools :board="board" :members="members"></nav-tools>
    <div class="lists-container">
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
  </div>
</template>

<script>

  import { boardService } from '../services/board.service.js'
  import { userService } from '../services/user.service.js'
  import navTools from '../cmps/nav-tools.cmp'

export default {
  name: 'board-edit',
  data(){
    return{
      board: null,
      members:[]
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
    },
    async getMember(memberId){
      console.log('memberId:',memberId);
      const member = await userService.getById(memberId)
      console.log(member);
      return member
    }
  },
  components:{
navTools
  },
  async created(){
    const boardId = this.$route.params.id
    const board = await boardService.getById(boardId)
    board.members.forEach( async (member) => {
        var memberObject = await this.getMember(member)
        this.members.push(memberObject)
    });
    console.log(this.members);
    this.board = JSON.parse(JSON.stringify(board))
  }
}
</script>