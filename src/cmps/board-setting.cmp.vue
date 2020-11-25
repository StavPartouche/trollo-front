<template>
    <form v-if="isSetting" action="">
      <input type="name" v-model="board.name" />
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