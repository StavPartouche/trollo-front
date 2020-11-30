<template>
  <div class="board-nav flex justify-space-between align-center">
    <div class="widht-200 flex justify-start align-center">
      <h2 contenteditable @blur="updateBoardName" v-text="nameToEdit">{{name }}</h2>
      <div class="board-setting-container">
      </div>
    </div>
    <board-member
      @removeBoardMember="removeBoardMember"
      @addBoardMember="addBoardMember"
      :boardMembers="members"
    />
    <!-- <button @click="toggleMenu" class="menu-btn widht-200 flex justify-end">
      <i v-if="isMenu" class="fas fa-times"></i>
      <i v-if="!isMenu" class="fas fa-ellipsis-h"></i>
    </button> -->
    <!-- <button v-if="isMenu" class="menu-btn widht-200 flex justify-end" @click="toggleMenu"><i class="fas fa-times"></i></button> -->
    <!-- <button v-if="isMenu" class="widht-200 flex justify-end" @click="toggleMenu"><i class="fas fa-times"></i></button> -->
    <div class="widht-200 flex justify-end">
    <button
      v-if="isMenu"
      class="open-menu-btn"
      @click="toggleMenu"
    >
      X
    </button>
    <!-- <button v-if="!isMenu" class="menu-btn widht-200 flex justify-end" @click="toggleMenu"><i class="fas fa-ellipsis-h"></i></button> -->
    <button
      v-if="!isMenu"
      class="open-menu-btn"
      @click="toggleMenu"
    >
      MORE
    </button>
    </div>
  </div>
</template>

<script>
import boardMember from "./board-member.cmp";
export default {
  name: "board-nav",
  props: {
    name: String,
    members: Array,
  },
  data() {
    return {
      isMenu: false,
      nameToEdit: null
    };
  },
  computed: {},
  methods: {
    toggleMenu() {
      this.isMenu = !this.isMenu;
      this.$emit('toggleMenu', this.isMenu)
    },
    addBoardMember(memberId) {
      this.$emit("addBoardMember", memberId);
    },
    removeBoardMember(memberId) {
      this.$emit("removeBoardMember", memberId);
    },
    updateBoardName(evt){
      	var src = evt.target.innerText;
			this.nameToEdit = src;
      this.$emit('updateBoardName', this.nameToEdit)
    }
  },
  components: {
    boardMember,
  },
  created() {
this.nameToEdit=this.name
  },
  destroyed() {
  },
};
</script>