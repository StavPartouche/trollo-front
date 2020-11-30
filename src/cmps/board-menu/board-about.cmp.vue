<template>
  <div class="board-about" action="">
    <div class="menu-header">
      <h3>About this board</h3>
      <button class="btn-back-to-menu" @click="backToMenu">Back</button>
    </div>

    <hr />
    <ul>
      <li class="bold">
        {{ name }}
      </li>
      <li>Made By</li>
      <li>
          Due Date:
          <input
            class="justify-end"
            type="date"
            v-model="dueDate"
            @change="changeDueDate"
          />
      </li>
      <li>
          Description:
                <p contenteditable @blur="updateBoardDesc" v-text="descToEdit">{{descToEdit}}</p>

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
      descToEdit: null
    };
  },
  methods: {
    // changeDesc() {
    //   this.$emit("changeDesc", this.description);
    // },
    changeDueDate() {
      this.$emit("changeDueDate", this.dueDate);
    },
    backToMenu() {
      this.$emit("backToMenu");
    },
    updateBoardDesc(evt){
      var src = evt.target.innerText;
      this.descToEdit = src;
      this.$emit('updateBoardDesc', this.descToEdit)
    }
  },
  computed: {},
  created() {
    this.descToEdit=this.description
  },
  components: {},
};
</script>