<template>
  <div class="board-nav flex justify-space-between align-center">
    <div class="widht-200 flex justify-start align-center">
      <!-- <h2 @click="toggleIsSetting">{{ board.name }}</h2> -->
      <h2>{{name }}</h2>
      <div class="board-setting-container">
        <!-- <button @click="toggleIsSetting"><i class="el-icon-more"></i></button> -->
      </div>
    </div>
    <board-member
      @removeBoardMember="removeBoardMember"
      @addBoardMember="addBoardMember"
      :boardMembers="members"
    />
    <!-- <button @click="toggleMenu" class="menu-btn widht-200 flex justify-end">
      <i v-if="isMenu" class="fas fa-times"></i>
      <i v-if="!isMenu" class="fas fa-ellipsis-h"></i>
    </button> -->
    <!-- <button v-if="isMenu" class="menu-btn widht-200 flex justify-end" @click="toggleMenu"><i class="fas fa-times"></i></button> -->
    <!-- <button v-if="isMenu" class="widht-200 flex justify-end" @click="toggleMenu"><i class="fas fa-times"></i></button> -->
    <div class="widht-200 flex justify-end">
    <button
      v-if="isMenu"
      class="open-menu-btn"
      @click="toggleMenu"
    >
      X
    </button>
    <!-- <button v-if="!isMenu" class="menu-btn widht-200 flex justify-end" @click="toggleMenu"><i class="fas fa-ellipsis-h"></i></button> -->
    <button
      v-if="!isMenu"
      class="open-menu-btn"
      @click="toggleMenu"
    >
      MORE
    </button>
    </div>


    <!-- <button class="widht-200  flex justify-end" @click="toggleActivityLog"><i class="fas fa-ellipsis-h"></i></button> -->
    <!-- <ul v-if="isActivityLog">
      <li v-for="activity in board.activityLog" :key="activity.createdAt">
        {{ activity.userId }}:{{ activity.txt }} {{ activity.createdAt }}
      </li>
    </ul> -->
  </div>
</template>

<script>
// import boardSetting from "./board-setting.cmp";
import boardMember from "./board-member.cmp";
export default {
  name: "board-nav",
  props: {
    // board: Object,
    name: String,
    members: Array,
  },
  data() {
    return {
      // boardToEdit: null,
      // isActivityLog: false,
      // isSetting: false,
      isMenu: false,
    };
  },
  computed: {},
  methods: {
    toggleMenu() {
      this.isMenu = !this.isMenu;
      this.$emit('toggleMenu', this.isMenu)
    },
    saveBoardSetting(ev) {
      this.boardToEdit = ev.board;
      this.saveBoard(ev.close);
    },
    saveBoard(close = true) {
      this.$emit("saveBoard", JSON.parse(JSON.stringify(this.boardToEdit)));
      if (close) this.isSetting = false;
    },
    removeBoard() {
      this.$emit("removeBoard");
    },
    addBoardMember(memberId) {
      this.$emit("addBoardMember", memberId);
    },
    removeBoardMember(memberId) {
      this.$emit("removeBoardMember", memberId);
    },
  },
  components: {
    boardMember,
  },
  created() {

  },
  destroyed() {
  },
};
</script>