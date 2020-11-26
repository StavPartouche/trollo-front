<template>
  <div class="board-nav flex center">
    <!-- <pre>{{board}}</pre> -->
    <div class="board-setting-container">
      <button @click="toggleIsSetting">{{ board.name }}</button>
      <board-setting
        @removeBoard="removeBoard"
        @saveBoard="saveBoardSetting"
        v-if="isSetting"
        :board="boardToEdit"
      />
    </div>
    <ul>
      <li v-for="member in members" :key="member._id">
        {{ member.userName }}
      </li>
    </ul>
    <button @click="toggleActivityLog">activity log</button>
    <ul v-if="isActivityLog">
      <li v-for="activity in board.activityLog" :key="activity.createdAt">
        {{ activity.userId }}:{{ activity.txt }} {{ activity.createdAt }}
      </li>
    </ul>
  </div>
</template>

<script>
import boardSetting from "./board-setting.cmp";
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
      this.$emit('saveBoard', JSON.parse(JSON.stringify(this.boardToEdit)));
      this.isSetting = false;
    },
    removeBoard() {
      this.$emit('removeBoard');
    },
  },
  components: {
    boardSetting,
  },
  created() {
    console.log(this.board);
    this.boardToEdit = JSON.parse(JSON.stringify(this.board));
  },
};
</script>