<template>
  <div class="board-nav flex justify-space-between align-center">
    <!-- <div v-if="isMenu" @click="closeMenu" class="disable-page-container"></div> -->
    <div v-if="menu" @click="closeMenu" class="disable-page-container"></div>
    <div class="flex center">
      <h2
        class="board-name"
        contenteditable
        @blur="updateBoardName"
        v-text="nameToEdit"
      >
        {{ nameToEdit }}
      </h2>
      <input
        class="board-nav-btn"
        type="text"
        placeholder="Search Task"
        @keydown.enter="emitSearch"
        @input="emitSearch"
      />
      <button class="board-nav-btn" @click="toggleFilter">
        {{ filterSelect }}
      </button>
      <div
        v-if="isFilterOpts"
        @click="toggleFilter"
        class="disable-page-container"
      ></div>
      <div class="lists-filter" v-if="isFilterOpts">
        <p v-if="!members">No users to show</p>
        <input
          v-else
          type="text"
          placeholder="Search member"
          v-model="filterBy"
        />
        <ul>
          <li
            v-if="!filterBy"
            class="userToShow flex align-center"
            @click="emitFilter('', 'All Members')"
          >
            <p>All Members</p>
          </li>
          <li
            class="userToShow flex align-center"
            v-for="member in membersToShow"
            :key="member._id"
            @click="emitFilter(member._id, member.fullName)"
          >
            <p>{{ member.fullName }}</p>
          </li>
        </ul>
      </div>
    </div>
    <div class="flex center">
      <board-member
        @removeBoardMember="removeBoardMember"
        @addBoardMember="addBoardMember"
        :boardMembers="members"
      />
      <!-- <button class="board-nav-btn">Team</button> -->
      <button @click="openBackground" class="board-nav-btn">
		  <font-awesome-icon class="board-nav-icon" :icon="['fas', 'paint-roller']" />
		</button>
      <button @click="openDashboard" class="board-nav-btn">
        <font-awesome-icon class="board-nav-icon" :icon="['fas', 'chart-bar']" />
      </button>
      <div class="board-nav-btn settings-icon-container flex center">
        <!-- <button v-if="isMenu" @click="closeMenu" class="open-menu-btn"> -->
        <button v-if="menu" @click="closeMenu" class="open-menu-btn times">
          <font-awesome-icon :icon="['fas', 'times']" />
        </button>
        <!-- <button class="open-menu-btn" v-if="!isMenu" @click="openMenu"> -->
        <button v-if="!menu" @click="openMenu">
          <!-- <font-awesome-icon :icon="['fas', 'ellipsis-h']" />
          Show Menu -->
		  <font-awesome-icon class="settings-icon" :icon="['fas', 'sliders-h']" />
        </button>
      </div>
    </div>
    <dashboard
      v-if="isDashboeard"
      :members="members"
      :board="board"
      @closeDashbord="closeDashbord"
    />
    <div
      v-if="isDashboeard"
      @click="closeDashbord"
      class="disable-page-container"
    ></div>
  </div>
</template>



<script>
import boardMember from "./board-member.cmp";
import boardMemberCard from "./board-member-card.cmp";
import dashboard from "../dashboard.cmp";
import _ from "lodash";

export default {
  name: "board-nav",
  props: {
    name: String,
    members: Array,
    board: Object,
  },
  data() {
    return {
      // isMenu: false,
      menu: null,
      isBacground: false,
      nameToEdit: null,
      isDashboeard: false,
      filterBy: "",
      filterSelect: "All Members",
      isFilterOpts: false,
    };
  },
  computed: {
    membersToShow() {
      return this.members.filter((member) =>
        member.fullName.toLowerCase().includes(this.filterBy.toLowerCase())
      );
    },
  },
  methods: {
    closeDashbord() {
      this.isDashboeard = false;
    },
    openDashboard() {
      this.isDashboeard = true;
    },
    openMenu() {
      this.menu = "main";
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
    openBackground() {
      this.menu = "bgc";
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
      if (ev.keyCode === 27 && this.menu) this.closeMenu();
    },
    toggleFilter() {
      this.isFilterOpts = !this.isFilterOpts;
    },
    emitFilter(memberId, fullName) {
      this.$emit("filter", memberId);
      this.filterSelect = fullName;
      this.isFilterOpts = false;
    },
    emitSearch(ev) {
      this.$emit("search", ev.target.value);
    },
  },
  watch: {
    name() {
      this.nameToEdit = this.name;
    },
  },
  components: {
    boardMember,
    dashboard,
  },
  created() {
    this.nameToEdit = this.name;
    this.emitSearch = _.debounce(this.emitSearch, 500);
    document.body.addEventListener("keyup", this.onKeyUp);
  },
  destroyed() {
    document.body.removeEventListener("keyup", this.onKeyUp);
  },
};
</script>