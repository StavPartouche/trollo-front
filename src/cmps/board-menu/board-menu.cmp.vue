<template>
  <div class="board-menu">
    MENU
    <ul>
      <li @click.stop="toggleIsAbout" class="menu-btn">about this board</li>
      <board-about
        @changeName="changeName"
        @changeDesc="changeDesc"
        @changeDueDate="changeDueDate"
        @removeBoard="removeBoard"
        v-if="isAbout"
        :name="name"
        :description="description"
        :dueDate="dueDate"
      />
      <li @click="toggleIsBackground" class="menu-btn">change background</li>
      <board-background @saveBoardBgc="saveBoardBgc" v-if="isBackground"></board-background>
      <li @click.stop="removeBoard" class="menu-btn">Delete board</li>

      <li class="menu-btn">Activity-log</li>
    </ul>
    <!-- <div
      @click="toggleMenu"
      :class="{ 'hide': !isMenu, 'disable-page-container': isMenu }"
    ></div> -->
  </div>
</template>

    
<script>
import boardAbout from "./board-about.cmp";
import boardBackground from "./board-background.cmp";
export default {
  name: "board-menu",
  props: {
    name: String,
    description: String,
    dueDate: String,
  },
  data() {
    return {
      isActivityLog: false,
      isAbout: false,
      isBackground: false,
    };
  },
  computed: {},
  methods: {
    saveBoardBgc(bgc) {
        this.$emit('saveBoardBgc', bgc)
      },
    toggleActivityLog() {
      this.isActivityLog = !this.isActivityLog;
    },
    toggleIsAbout() {
      this.isAbout = !this.isAbout;
      console.log(this.isAbout);
    },
    toggleIsBackground() {
      this.isBackground = !this.isBackground;
    },
    changeName(name) {
      this.$emit("changeName", name);
    },
    changeDesc(desc) {
      this.$emit("changeDesc", desc);
    },
    changeDueDate(dueDate) {
      this.$emit("changeDueDate", dueDate);
    },
    removeBoard() {
      this.$emit("removeBoard");
    },
  },
  components: {
    boardAbout,
    boardBackground,
  },
  created() {
    console.log(this.dueDate);
    // this.boardToEdit = JSON.parse(JSON.stringify(this.board));
    // document.body.addEventListener("keyup", this.onKeyUp);
  },
  destroyed() {
    // document.body.removeEventListener("keyup", this.onKeyUp);
  },
};
</script>
