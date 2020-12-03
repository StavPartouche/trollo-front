<template>
    <div class="list-edit-menu">
      <h3>Edit List</h3>
      <button @click="openWarning(listIdx)">Delete List</button>
      <button @click="toggleAdd">Add card</button>
    </div>
</template>

<script>
export default {
  name: "list-edit-menu",
  props: {
    listIdx: Number,
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    removeList(listIdx) {
      this.$emit("removeList", listIdx);
    },
    toggleAdd() {
      this.$emit("closeListEdit");
      this.$emit("toggleAdd");
    },
    openWarning(listIdx) {
        this.$confirm('This will permanently delete the list. Continue?', 'Warning!', {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          customClass:'delete-warning',
          type: 'warning'
        }).then(() => {
          this.removeList(listIdx)
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
};
</script>