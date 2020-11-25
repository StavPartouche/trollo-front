<template>
  <div class="nav-tools flex center">
    <!-- <pre>{{board}}</pre> -->
    <button @click="toggleIsSetting">{{ board.name }}</button>
    <board-setting
      @saveBoard="saveBoardSetting"
      v-if="isSetting"
      :board="boardToEdit"
    />
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
  name: "nav-tools",
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
  computed: {

  },
  methods: {
    toggleActivityLog() {
      this.isActivityLog = !this.isActivityLog;
    },
    toggleIsSetting() {
      this.isSetting = !this.isSetting;
    },
    saveBoardSetting(board) {
      this.boardToEdit = board ;
      this.updateBoard();
    },
    updateBoard(){
      this.$emit('updateBoard', this.boardToEdit)
    }
  },
  components: {
    boardSetting,
  },
  created(){
    console.log(this.board);
    this.boardToEdit = JSON.parse(JSON.stringify(this.board))
  }
};
</script>