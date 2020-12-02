<template>
  <div class="flex align-center justify-space-between">
    <div class="flex align-center">
      <p v-if="task.description !== ''">D</p>
	  <p v-if="task.comments.length">C{{task.comments.length}}</p>
      <p v-if="task.attachments.length">A{{ task.attachments.length }}</p>
      <p v-if="task.checkLists.length">I{{ doneItems }}/{{ allItems }}</p>
    </div>
    <ul class="flex" v-if="task.members.length">
      <li v-for="memberId in task.members" :key="memberId">
        <user-avatar :user="getMemberById(memberId)"></user-avatar>
      </li>
    </ul>
  </div>
</template>

<script>
import userAvatar from "./user-avatar.cmp";

export default {
  name: "taskPreviewFooter",
  props: {
    task: Object,
    members: Array,
  },
  data() {
    return {};
  },
  computed: {
    doneItems() {
      var sum = 0;
      this.task.checkLists.forEach((checkList) => {
        checkList.items.forEach((item) => {
          if (item.isDone === true) sum++;
        });
      });
      return sum;
    },
    allItems() {
      var sum = 0;
      this.task.checkLists.forEach((checkList) => {
        checkList.items.forEach((item) => {
          sum++;
        });
      });
      return sum;
    },
  },
  methods: {
    getMemberById(id) {
      const arr = this.members.filter((member) => member._id === id);
      if (!arr.length) return;
      return arr[0];
    },
  },
  components: {
    userAvatar,
  },
  created() {
    console.log(this.task);
  },
};
</script>