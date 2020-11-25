<template>
    <form class="board-setting" v-if="boardToEdit" @submit.prevent="saveChanges" action="">
      <label for="">
      <input type="text" v-model="boardToEdit.name" />
      </label>
      <label for="">
        Due Date:
      <input type="date" v-model="boardToEdit.createdAt" />
      </label>
      <label for="">
        Description:
      <input type="text" v-model="boardToEdit.description" />
      </label>
      <label for="">
        Image:
      <input type="text" v-model="boardToEdit.style.url" />
      </label>
      <button type="button">Delete Board</button>
      <button>save</button>
    </form>
</template>

<script>
export default {
  name: "board-setting",
  props: {
    board: Object,
  },
  data() {
    return {
      boardToEdit: null
    };
  },
  methods: {
    saveChanges() {
      console.log('save changes');
      this.$emit('saveBoard', this.boardToEdit)
    },
  },
  created(){
    this.boardToEdit = JSON.parse(JSON.stringify(this.board));
    console.log(this.boardToEdit);
  }
};
</script>