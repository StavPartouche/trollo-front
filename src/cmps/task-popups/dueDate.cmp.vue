<template>
  <div class="task-popup due-date">
    <h3 class="task-popup-header">Due date</h3>
    <button @click="closePopup" class="exit-popup-btn"><font-awesome-icon :icon="['fas', 'times']" /></button>
    <input @input="updateDueDate" type="date" v-model="date" />
  </div>
</template>

<script>
export default {
  name: "dueDate",
  data() {
    return {
      date: "",
    };
  },
  methods: {
      updateDueDate() {
        this.$emit("updateDueDate", this.date);
      },
    closePopup() {
      this.$emit("closePopup");
    },
  },
};
</script>