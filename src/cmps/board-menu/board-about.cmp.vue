<template>
  <div class="board-about" action="">
    <div class="menu-header">
      <h3>About this board</h3>
      <!-- <button class="btn-back-to-menu" @click="backToMenu">Back</button> -->
      <!-- <button class="btn-back-to-menu" @click="backToMenu"><i class="fas fa-chevron-left"></i></button> -->
      <!-- <button class="btn-back-to-menu" @click="backToMenu"><font-awesome-icon icon="user-secret" /></button> -->
      <!-- <button class="btn-back-to-menu" @click="backToMenu"><font-awesome-icon :icon="['fas', 'user-secret']" /></button> -->
      <button class="btn-back-to-menu" @click="backToMenu"><font-awesome-icon :icon="['fas', 'chevron-left']" /></button>
    </div>

    <hr />
    <ul>
      <li class="bold">
        <h3>{{ name }}</h3>
      </li>
      <!-- <li>Made By</li> -->
      <li>
        <h4>Due Date:</h4>

        <input
          class="justify-end"
          type="date"
          v-model="dueDateEdit"
          @change="updateBoardDueDate"
        />
      </li>
      <li>
        <h4>Description:</h4>
        <p
          class="board-desc-content"
          contenteditable
          @blur="updateBoardDesc"
          v-text="descToEdit"
        >
          {{ descToEdit }}
        </p>

        <!-- <textarea
            class="justify-end"
            type="text"
            v-model="description"
            @change="changeDesc"
          /> -->
      </li>
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
    updateBoardDueDate() {
      this.$emit("updateBoardDueDate", this.dueDateEdit);
    },
    backToMenu() {
      this.$emit("backToMenu");
    },
    updateBoardDesc(evt) {
      var src = evt.target.innerText;
      this.descToEdit = src;
      this.$emit("updateBoardDesc", this.descToEdit);
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