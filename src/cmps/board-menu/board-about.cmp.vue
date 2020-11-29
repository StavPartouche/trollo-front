<template>
  <form
    class="board-setting flex-column justify-center"
    @submit.prevent="saveChanges"
    action=""
  >
    <label for="">
      <input type="text" v-model="name" @change="changeName" />
    </label>
    <label class="flex align-center" for="">
      Due Date:
      <input
        class="justify-end"
        type="date"
        v-model="dueDate"
        @change="changeDueDate"
      />
    </label>
    <label class="flex align-center" for="">
      Description:
      <input
        class="justify-end"
        type="text"
        v-model="description"
        @change="changeDesc"
      />
    </label>
  </form>
</template>

<script>

export default {
  name: "board-about",
  props: {
    name: String,
    description: String,
    dueDate: String,
  },
  data() {
    return {
    };
  },
  methods: {
    changeName() {
      this.$emit("changeName", this.name);
    },
    changeDesc() {
      this.$emit("changeDesc", this.description);
    },
    changeDueDate() {
      this.$emit("changeDueDate", this.dueDate);
    },
  },
  computed: {},
  created() {
    // this.boardToEdit = JSON.parse(JSON.stringify(this.board));
    // console.log(this.boardToEdit.style.url);
  },
  components: {
    // boardBackground,
  },
};
</script>