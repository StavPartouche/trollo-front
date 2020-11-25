<template>
  <div>
    <ul>
      <li v-for="board in boardsToShow" :key="board._id">
        <router-link :to="'/board/' + board._id" >{{board.name}}</router-link>
      </li>
      <li>
        <button @click="addBoard">add board</button>
      </li>
    </ul>
  </div>
</template>

<script>

import { boardService } from '../services/board.service.js'

export default {
  name: 'board-list',
  data(){
    return{
      boards: [],
    }
  },
  methods:{ 
    async addBoard(){
        var newBoard = boardService.getEmptyBoard()
        newBoard.name = prompt('Enter Board name')
        var saveBoard = await this.$store.dispatch({
                type: 'saveBoard',
                board: newBoard
            })
        this.$router.push(`/board/${saveBoard._id}`)
    }
  },
  computed:{
    boardsToShow(){
      return this.$store.getters.boardsForDisplay;
    }
  },
  created(){
    
  }
}
</script>