<template>
  <div class="board-about" action="">
    <div class="menu-header">
      <h3>About this board</h3>
      <button class="btn-back-to-menu" @click="backToMenu">
        <font-awesome-icon :icon="['fas', 'chevron-left']" />
      </button>
    </div>

    <hr />
    <ul class="board-about-container">
      <div>
        <li class="bold">
          {{ name }}
        </li>
        <li>
          Due Date:
          <el-date-picker class="date-input"
            @input="updateBoardDueDate" 
            v-model="dueDateEdit"
            type="date"
            placeholder="Pick a day"
            picker-options="Pick a day">
          </el-date-picker>
        </li>
        <li>
          Description:
              <textarea
              placeholder="Describe here..."
              class="board-desc-content"
              v-model="descToEdit"
              @blur="updateBoardDesc"
              cols="40"
              rows="6"
            ></textarea>
        </li>
      </div>
      <li @click.stop="removeBoard" class="menu-delete-board">Delete board</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "board-about",
  props: {
    name: String,
    description: String,
    dueDate: [String,Date],
  },
  data() {
    return {
      descToEdit: null,
      dueDateEdit: null
    };
  },
  methods: {
    removeBoard(){
      this.$emit("removeBoard");
    },
    updateBoardDueDate() {
      this.$emit("updateBoardDueDate", this.dueDateEdit);
    },
    backToMenu() {
      this.$emit("backToMenu");
    },
    updateBoardDesc() {
      this.$emit("updateBoardDesc", this.descToEdit);
    },
  },
  watch: {
    description() {
      this.descToEdit = this.description;
    },
  },
  computed: {},
  created() {
    this.descToEdit = this.description;
    this.dueDateEdit = this.dueDate;
  },
  components: {},
};
</script>