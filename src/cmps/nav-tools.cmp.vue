<template>
  <div v-if="board" class="nav-tools flex center">
    <!-- <h1>navTools</h1> -->
    <button @click="toggleIsSetting">{{ board.name }}</button>
    <form v-if="isSetting" action="">
      <input type="name" v-model="board.name" />
    </form>
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
export default {
  name: "nav-tools",
  props: {
    board: Object,
    members: Array,
  },
  data() {
    return {
      isActivityLog: false,
      isSetting: false,
    };
  },
  methods: {
    toggleActivityLog() {
      this.isActivityLog = !this.isActivityLog;
    },
    toggleIsSetting() {
      this.isSetting = !this.isSetting;
    },
  },
};
</script>