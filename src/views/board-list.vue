<template>
  <div>
    <ul>
      <li v-for="board in boards" :key="board._id">
        <router-link :to="'/board/' + board._id" >{{board.name}}</router-link>
      </li>
      <li>
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
      boards: [{
        _id: 'ddfdfodiji',
        name: 'test'
      }],
      newBoard: null
    }
  },
  methods:{

  },
  created(){
    this.newBoard = boardService.getEmptyBoard()
    console.log("🚀 ~ file: board-list.vue ~ line 25 ~ created ~ this.newBoard", this.newBoard)
    
  }
}
</script>