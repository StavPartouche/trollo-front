<template>
  <div class="board-about" action="">
    <div class="menu-header">
      <h3>About this board</h3>
      <button class="btn-back-to-menu" @click="backToMenu">
        <font-awesome-icon :icon="['fas', 'chevron-left']" />
      </button>
    </div>

    <hr />
    <ul>
      <li class="bold">
        <!-- <h3>{{ name }}</h3> -->
        {{ name }}
      </li>
      <!-- <li>Made By</li> -->
      <li>
        Due Date:
        <!-- <h4>Due Date:</h4> -->

        <input
          class="justify-end"
          type="date"
          v-model="dueDateEdit"
          @change="updateBoardDueDate"
        />
      </li>
      <li>
        Description:
        <!-- <h4>Description:</h4> -->
            <textarea
            placeholder="Describe here..."
            class="board-desc-content"
            v-model="descToEdit"
            @blur="updateBoardDesc"
            cols="40"
            rows="6"
          ></textarea>
      </li>
      <li @click.stop="removeBoard" class="menu-btn">Delete board</li>
    </ul>
  </div>
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
      descToEdit: null,
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