<template>
  <form
    class="board-setting flex-column .justify-center"
    v-if="boardToEdit"
    @submit.prevent="saveChanges"
    action=""
  >
    <label for="">
      <input type="text" v-model="boardToEdit.name" />
    </label>
    <label class="flex align-center" for="">
      Due Date:
      <input class="justify-end" type="date" v-model="boardToEdit.dueDate" />
    </label>
    <label class="flex align-center" for="">
      Description:
      <input
        class="justify-end"
        type="text"
        v-model="boardToEdit.description"
      />
    </label>
    <div class="flex center">
      <p @click="toggleBackground">choose your background:  </p>
      <div v-if="imgUrl === 'color'"></div>
      <div v-else class="img-circle">
        <img
          @click="toggleBackground"
          :src="require(`@/styles/assets/board-background-imgs/${imgUrl}`)"
        />
      </div>
    </div>
    <board-background
      @saveBoardBgc="saveBoardBgc"
      v-if="isBackground"
      imgUrl="imgUrl"
    />
    <div class="flex center">
      <button title="delete board" @click="removeBoard" type="button">
        <i class="fas fa-trash"></i>
      </button>
      <button>save</button>
    </div>
  </form>
</template>

<script>
import boardBackground from "./board-background.cmp";

export default {
  name: "board-setting",
  props: {
    board: Object,
  },
  data() {
    return {
      boardToEdit: null,
      isBackground: false,
    };
  },
  methods: {
    saveChanges() {
      this.$emit("saveBoard", this.boardToEdit);
    },
    saveBoardBgc(imgUrl) {
      this.boardToEdit.style.url = imgUrl;
    },
    toggleBackground() {
      this.isBackground = !this.isBackground;
    },
    removeBoard() {
      this.$emit("removeBoard");
    },
  },
  computed: {
    imgUrl() {
      return this.boardToEdit.style.url;
    },
  },
  created() {
    this.boardToEdit = JSON.parse(JSON.stringify(this.board));
    console.log(this.boardToEdit.style.url);
    document.body.addEventListener('keyup', this.onKeyUp)
  },
  components: {
    boardBackground,
  },
};
</script>