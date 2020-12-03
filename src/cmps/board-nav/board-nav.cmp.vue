<template>
  <div class="board-nav flex justify-space-between align-center">
        <div v-if="isMenu" @click="closeMenu" class="disable-page-container"></div>
      <h2 class="board-nav-btn board-name" contenteditable @blur="updateBoardName" v-text="nameToEdit">
        {{ nameToEdit }}
      </h2>
    <div class="board-nav-btn flex center">
    <board-member
      @removeBoardMember="removeBoardMember"
      @addBoardMember="addBoardMember"
      :boardMembers="members"
    />
    <!-- <button> -->
      <font-awesome-icon
       class=" open-menu-btn"
        v-if="isMenu"
        @click="closeMenu"
        :icon="['fas', 'times']"
      />
      
    <!-- </button> -->
    <!-- <button> -->
      <font-awesome-icon
       class=" open-menu-btn"
        v-if="!isMenu"
        @click="openMenu"
        :icon="['fas', 'ellipsis-h']"
      />
      <!-- Show Menu -->
    <!-- </button> -->
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
      nameToEdit: null,
    };
  },
  computed: {},
  methods: {
    openMenu() {
      this.isMenu = true;
      this.$emit("toggleMenu", this.isMenu);

    },
    closeMenu() {
      this.isMenu = false;
      this.$emit("toggleMenu", this.isMenu);
    },
    addBoardMember(memberId) {
      this.$emit("addBoardMember", memberId);
    },
    removeBoardMember(memberId) {
      this.$emit("removeBoardMember", memberId);
    },
    updateBoardName(evt) {
      var src = evt.target.innerText;
      this.nameToEdit = src;
      this.$emit("updateBoardName", this.nameToEdit);
    },
    onKeyUp(ev){
      if (ev.keyCode === 27 && this.isMenu) this.closeMenu()
    },
  },
  watch: {
    name() {
      this.nameToEdit = this.name;
    }
  },
  components: {
    boardMember,
  },
  created() {
    this.nameToEdit = this.name;
    document.body.addEventListener("keyup", this.onKeyUp);

  },
  destroyed() {
    document.body.removeEventListener("keyup", this.onKeyUp);

  },
};
</script>