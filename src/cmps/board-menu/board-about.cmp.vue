<template>
  <form
    class="board-setting"
    @submit.prevent="saveChanges"
    action=""
  >
    <div class="menu-header">
      <h3>About this board</h3>
      <button class="btn-back-to-menu" @click="backToMenu">Back</button>
    </div>

    <hr>

    <h5>{{ name }}</h5>
    <h5>Made By</h5>
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
      <textarea
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
    return {};
  },
  methods: {
    changeDesc() {
      this.$emit("changeDesc", this.description);
    },
    changeDueDate() {
      this.$emit("changeDueDate", this.dueDate);
    },
    backToMenu() {
      this.$emit("backToMenu");
    },
  },
  computed: {},
  created() {
  },
  components: {
  },
};
</script>