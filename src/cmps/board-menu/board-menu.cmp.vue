<template>
  <div class="board-menu">
    <div v-if="isMainMenu" class="main-menu">
      <div class="menu-header">
      <h3 >Menu</h3>
      </div>
      <hr />
      <ul>
        <li @click.stop="toggleIsAbout" class="menu-btn">About this board</li>

        <li @click="toggleIsBackground" class="menu-btn">Change background</li>

        <li @click.stop="openWarning" class="menu-btn">Delete board</li>
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
      this.$emit("removeBoard");
    },
    backToMenu() {
      this.isActivityLog = false;
      this.isAbout = false;
      this.isBackground = false;
      console.log(this.isMainMenu);
    },
    onKeyUp(ev){
      if (ev.keyCode === 27) {
        if (this.isPopup) this.closePopup();
        else this.closeDetails();
      }
    },
    openWarning() {
        this.$confirm('This will permanently delete the task. Continue?', 'Warning', {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.removeBoard()
          this.$message({
            type: 'success',
            message: 'Delete completed'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Delete canceled'
          });          
        });
    }
  },
  components: {
    boardAbout,
    boardBackground
  },
  created() {
    
  },
  destroyed() {
    
  },
};
</script>
