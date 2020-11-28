<template>
  <div class="task-popup">
    <h3 class="task-popup-header">dueDate</h3>
    <button @click="closePopup" class="exit-popup-btn">X</button>
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
        this.$emit("taskUpdate", {
          type: "updateDueDate",
          value: this.date,
        });
      },
    closePopup() {
      this.$emit("closePopup");
    },
  },
};
</script>