<template>
  <!-- <div @click="closeMenu" class="list-edit-menu-container"> -->
    <div class="list-edit-menu">
      <h3>Edit List</h3>
      <button @click="removeList(listIdx)">Delete List</button>
      <button @click="toggleAdd">Add card</button>
    </div>
  <!-- </div> -->
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
    closeMenu(){
      this.$emit("toggleListEdit");
    },
    removeList(listIdx) {
      this.$emit("removeList", listIdx);
    },
    toggleAdd() {
      this.$emit("toggleListEdit");
      this.$emit("toggleAdd");
    }
  },
};
</script>