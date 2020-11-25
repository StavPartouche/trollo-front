<template>
  <div>
<nav-tools v-model="board"></nav-tools>
    <ul v-if="board">
      <li v-for="list in board.lists" :key="list.id">
        {{list.name}}
        <button>Add task</button>
      </li>
    </ul>
    <button @click="addList">Add list</button>
  </div>
</template>

<script>

  import { boardService } from '../services/board.service.js'
  import navTools from '../cmps/nav-tools.cmp'

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
                board
      })
    }
  },
  components:{
navTools
  },
  async created(){
    const boardId = this.$route.params.id
    const board = await boardService.getById(boardId)
    this.board = JSON.parse(JSON.stringify(board))
  }
}
</script>