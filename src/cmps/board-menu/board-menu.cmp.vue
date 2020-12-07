<template>
  <div class="board-menu">
    <div v-if="isMainMenu" class="main-menu flex-column">
      <div class="menu-header">
      <h3 >Menu</h3>
      </div>
      <hr />
      <ul class="menu-ops">
        <li @click.stop="toggleIsAbout" class="menu-btn">About this board</li>

        <li @click="toggleIsBackground" class="menu-btn">Change background</li>

        <hr />
        <li class="menu-btn" @backToMenu="backToMenu">
          Activity-log
        </li>
      </ul>
          <ul class="menu-activity">
            <board-activity v-for="(activity, idx) in activities" :key="idx" :activity="activity"/>
          </ul>
    </div>
          <board-about
        @backToMenu="backToMenu"
        @updateBoardDesc="updateBoardDesc"
        @updateBoardDueDate="updateBoardDueDate"
        @removeBoard="openWarning"
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
  </div>
</template>

    
<script>
import boardAbout from "./board-about.cmp";
import boardBackground from "./board-background.cmp";
import boardActivity from './board-activity.cmp.vue'
export default {
  name: "board-menu",
  props: {
    name: String,
    description: String,
    dueDate: [String, Date],
    activities: Array,
    menu: String
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
    },
    toggleIsAbout() {
      this.isAbout = !this.isAbout;
    },
    toggleIsBackground() {
      this.isBackground = !this.isBackground;
    },

    updateBoardDesc(desc) {
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
    },
    onKeyUp(ev){
      if (ev.keyCode === 27) {
        if (this.isPopup) this.closePopup();
        else this.closeDetails();
      }
    },
    openWarning() {
        this.$confirm('This will permanently delete the board. Continue?', 'Warning!', {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          customClass:'delete-warning',
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
    boardBackground,
    boardActivity
  },
  watch:{
menu(){
  console.log(this.menu);
      if (this.menu==='bgc') this.isBackground = true;
      if (this.menu==='main') this.backToMenu();
}
  },
  created() {
    if (this.menu==='bgc') this.isBackground = true;
  },
  destroyed() {
    
  },
};
</script>
