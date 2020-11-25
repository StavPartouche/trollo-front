<template>
    <form class="board-setting" v-if="boardToEdit" @submit.prevent="saveChanges" action="">
      <label for="">
      <input type="text" v-model="boardToEdit.name" />
      </label>
      <label for="">
        Due Date:
      <input type="date" v-model="boardToEdit.dueDate" />
      </label>
      <label for="">
        Description:
      <input type="text" v-model="boardToEdit.description" />
      </label>
      <pre>{{boardToEdit.style.url}}</pre>
      <!-- <img src="src\styles\assets\board-background-imgs\bgc1.jpg" alt=""> -->
      <div class="img-circle">
      <img src="@/styles/assets/board-background-imgs/bgc1.jpg" alt="">
      </div>
      <img @click="toggleBackground" :src="boardToEdit.style.url" />
      <img :src="imgUrl" />
      <board-background v-if="isBackground" imgUrl="imgUrl"/>
      <button type="button">Delete Board</button>
      <button>save</button>
    </form>
</template>

<script>
import boardBackground from './board-background.cmp'
export default {
  name: "board-setting",
  props: {
    board: Object,
  },
  data() {
    return {
      boardToEdit: null,
      isBackground: false
    };
  },
  methods: {
    saveChanges() {
      console.log('save changes');
      this.$emit('saveBoard', this.boardToEdit)
    },
    toggleBackground(){
      this.isBackground=!this.isBackground
    }
  },
  computed:{
imgUrl(){
  return this.boardToEdit.style.url
}
  },
  created(){
    this.boardToEdit = JSON.parse(JSON.stringify(this.board));
    console.log(this.boardToEdit);
  },
  components:{
    boardBackground
  }
};
</script>