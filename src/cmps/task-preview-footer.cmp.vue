<template>
  <div class="task-preview-footer">
    <div class="task-preview-data">
		<p class="task-preview-data-item" v-if="task.description !== ''">
	  		<font-awesome-icon class="task-preview-data-item-icon" :icon="['fas', 'align-left']" />
		</p>
		<p class="task-preview-data-item" v-if="task.comments.length" >
	  		<font-awesome-icon class="task-preview-data-item-icon" :icon="['far', 'comment']" /> {{task.comments.length}}
		</p>
		<p class="task-preview-data-item" v-if="task.attachments.length" >
	  		<font-awesome-icon class="task-preview-data-item-icon" :icon="['fas', 'paperclip']" /> {{task.attachments.length}}
		</p>
		<p class="task-preview-data-item" v-if="task.checkLists.length">
			<font-awesome-icon class="task-preview-data-item-icon" :icon="['fas', 'tasks']" /> {{ doneItems }}/{{ allItems }}
		</p>
    </div>
    <ul class="task-preview-members flex" v-if="task.members.length">
      <li v-for="memberId in task.members" :key="memberId">
        <user-avatar :width="25" :user="getMemberById(memberId)"></user-avatar>
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
  },
};
</script>