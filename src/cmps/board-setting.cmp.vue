<template>
    <form @submit.prevent="saveChanges" v-if="isSetting" action="">
      <input type="text" v-model="board.name" />
      <input type="date" v-model="board.createdAt" />
      <input type="text" v-model="board.description" />
      <input type="text" v-model="board.style.url" />
      <button type="button">Delete Board</button>
      <button>save</button>
    </form>
</template>

<script>
export default {
  name: "nav-tools",
  props: {
    board: Object,
  },
  data() {
    return {
      isActivityLog: false,
      isSetting: false,
    };
  },
  methods: {
    saveChange() {
      this.$emit('input', this.board)
    },
  },
};
</script>