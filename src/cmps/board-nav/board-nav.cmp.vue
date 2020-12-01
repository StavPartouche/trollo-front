<template>
  <div class="board-nav flex justify-space-between align-center">
    <div class="widht-200 flex justify-start align-center">
      <!-- <h2 contenteditable @blur="updateBoardName" v-text="nameToEdit">{{name }}</h2> -->
      <h2 contenteditable @blur="updateBoardName" v-text="nameToEdit">
        {{ nameToEdit }}
      </h2>
      <div class="board-setting-container"></div>
    </div>
    <board-member
      @removeBoardMember="removeBoardMember"
      @addBoardMember="addBoardMember"
      :boardMembers="members"
    />
    <div class=" open-menu-btn widht-200 flex justify-end">
      <font-awesome-icon
        v-if="isMenu"
        @click="toggleMenu"
        :icon="['fas', 'times']"
      />
      <font-awesome-icon
        v-if="!isMenu"
        @click="toggleMenu"
        :icon="['fas', 'ellipsis-h']"
      />
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
    toggleMenu() {
      this.isMenu = !this.isMenu;
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
      if (ev.keyCode === 27 && this.isMenu) this.toggleMenu()
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