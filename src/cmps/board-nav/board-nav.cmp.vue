<template>
  <div class="board-nav flex justify-space-between align-center">
    <div
      @click="toggleIsSetting"
      :class="{ 'hide': !isSetting, 'disable-page-container': isSetting }"
    ></div>
    <div class="flex center">
      <h2 @click="toggleIsSetting">{{ board.name }}</h2>
      <div class="board-setting-container">
        <button @click="toggleIsSetting"><i class="el-icon-more"></i></button>
        <board-setting
          @removeBoard="removeBoard"
          @saveBoard="saveBoardSetting"
          v-if="isSetting"
          :board="boardToEdit"
        />
      </div>
    </div>
    <board-member
      @removeBoardMember="removeBoardMember"
      @addBoardMember="addBoardMember"
      :boardMembers="members"
    />
    <!-- <ul>
      <li v-for="member in members" :key="member._id">
        {{ member.userName }}
      </li>
    </ul> -->
    <button @click="toggleActivityLog">activity log</button>
    <!-- <ul v-if="isActivityLog">
      <li v-for="activity in board.activityLog" :key="activity.createdAt">
        {{ activity.userId }}:{{ activity.txt }} {{ activity.createdAt }}
      </li>
    </ul> -->
  </div>
</template>

<script>
import boardSetting from "./board-setting.cmp";
import boardMember from "./board-member.cmp";
export default {
  name: "board-nav",
  props: {
    board: Object,
    members: Array,
  },
  data() {
    return {
      boardToEdit: null,
      isActivityLog: false,
      isSetting: false,
    };
  },
  computed: {},
  methods: {
    toggleActivityLog() {
      this.isActivityLog = !this.isActivityLog;
    },
    toggleIsSetting() {
      this.isSetting = !this.isSetting;
    },
    saveBoardSetting(board) {
      this.boardToEdit = board;
      this.saveBoard();
    },
    saveBoard() {
      this.$emit("saveBoard", JSON.parse(JSON.stringify(this.boardToEdit)));
      this.isSetting = false;
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
    boardSetting,
    boardMember,
  },
  created() {
    console.log(this.board);
    this.boardToEdit = JSON.parse(JSON.stringify(this.board));
  },
};
</script>