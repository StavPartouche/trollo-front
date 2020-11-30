<template>
  <div class="board-menu">
    <div v-if="isMainMenu">
      <div class="menu-header">
      <h3 >Menu</h3>
      </div>
      <hr />
      <ul>
        <li @click.stop="toggleIsAbout" class="menu-btn">About this board</li>

        <li @click="toggleIsBackground" class="menu-btn">Change background</li>

        <li @click.stop="removeBoard" class="menu-btn">Delete board</li>
        <hr />
        <li class="menu-btn" @backToMenu="backToMenu">Activity-log</li>
      </ul>
    </div>
          <board-about
        @backToMenu="backToMenu"
        @updateBoardDesc="updateBoardDesc"
        @updateBoardDueDate="updateBoardDueDate"
        @removeBoard="removeBoard"
        v-if="isAbout"
        :name="name"
        :description="description"
        :dueDate="dueDate"
      />
            <board-background
        @backToMenu="backToMenu"
        @saveBoardBgc="saveBoardBgc"
        v-if="isBackground"
      ></board-background>
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
  computed: {
    isMainMenu(){
      return (!(this.isActivityLog || this.isAbout || this.isBackground))
    }
  },
  methods: {
    saveBoardBgc(bgc) {
      this.$emit("saveBoardBgc", bgc);
    },
    toggleActivityLog() {
      this.isActivityLog = !this.isActivityLog;
      console.log(this.isMainMenu);
    },
    toggleIsAbout() {
      this.isAbout = !this.isAbout;
      console.log(this.isMainMenu);
    },
    toggleIsBackground() {
      this.isBackground = !this.isBackground;
      console.log(this.isMainMenu);
    },

    updateBoardDesc(desc) {
      console.log('update desc');
      this.$emit("updateBoardDesc", desc);
    },
    updateBoardDueDate(dueDate) {
      this.$emit("updateBoardDueDate", dueDate);
    },
    removeBoard() {
      if (prompt("sure?")) this.$emit("removeBoard");
    },
    backToMenu() {
      this.isActivityLog = false;
      this.isAbout = false;
      this.isBackground = false;
      console.log(this.isMainMenu);
    },
  },
  components: {
    boardAbout,
    boardBackground,
  },
  created() {
    console.log(this.isMainMenu);
    // this.boardToEdit = JSON.parse(JSON.stringify(this.board));
    // document.body.addEventListener("keyup", this.onKeyUp);
  },
  destroyed() {
    // document.body.removeEventListener("keyup", this.onKeyUp);
  },
};
</script>
