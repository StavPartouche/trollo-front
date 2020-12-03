<template>
  <div class="board-nav flex justify-space-between align-center">
    <!-- <div v-if="isMenu" @click="closeMenu" class="disable-page-container"></div> -->
    <div v-if="menu" @click="closeMenu" class="disable-page-container"></div>
    <div class="flex center">

    <h2
      class=" board-name"
      contenteditable
      @blur="updateBoardName"
      v-text="nameToEdit"
    >
      {{ nameToEdit }}
    </h2>
    <input class="board-nav-btn" type="text" name="" id="" placeholder="Search">
    <button class="board-nav-btn">Filter by Member</button>
    </div>
      <div class="flex center">
      <board-member
        @removeBoardMember="removeBoardMember"
        @addBoardMember="addBoardMember"
        :boardMembers="members"
      />
<!-- <button class="board-nav-btn">Team</button> -->
<button @click="openBackground" class="board-nav-btn">Background</button>
    <div class="board-nav-btn flex center">
      <!-- <button v-if="isMenu" @click="closeMenu" class="open-menu-btn"> -->
      <button v-if="menu" @click="closeMenu" class="open-menu-btn">
        <font-awesome-icon :icon="['fas', 'times']" />
      </button>
      <!-- <button class="open-menu-btn" v-if="!isMenu" @click="openMenu"> -->
      <button class="open-menu-btn" v-if="!menu" @click="openMenu">
        <font-awesome-icon :icon="['fas', 'ellipsis-h']" />
        Show Menu
      </button>
    </div>
      </div>
  </div>
</template>



<script>
import boardMember from "./board-member.cmp";
import boardMemberCard from "./board-member-card.cmp";

export default {
  name: "board-nav",
  props: {
    name: String,
    members: Array,
  },
  data() {
    return {
      // isMenu: false,
      menu: null,
      isBacground: false,
      nameToEdit: null,
    };
  },
  computed: {},
  methods: {
    openMenu() {
      this.menu = 'main';
      this.$emit("toggleMenu", this.menu);
      // this.isMenu = true;
      // this.$emit("toggleMenu", { menu: this.isMenu, background: this.isBackground });
    },
    closeMenu() {
      this.menu = null;
      this.$emit("toggleMenu", this.menu);
      // this.isMenu = false;
      // this.isBackground = false;
      // this.$emit("toggleMenu", { menu: this.isMenu, background: this.isBackground });
    },
    openBackground(){
      this.menu = 'bgc';
      this.$emit("toggleMenu", this.menu);
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
    onKeyUp(ev) {
      if (ev.keyCode === 27 && this.isMenu) this.closeMenu();
    },
  },
  watch: {
    name() {
      this.nameToEdit = this.name;
    },
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