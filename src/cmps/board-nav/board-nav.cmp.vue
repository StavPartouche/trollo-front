<template>
	<div class="board-nav">
		<div
			v-if="menu"
			@click="closeMenu"
			class="disable-page-container"
		></div>
		<div>
			<h2
				class="board-name"
				contenteditable
				@blur="updateBoardName"
				v-text="nameToEdit"
			>
				{{ nameToEdit }}
			</h2>
		</div>

		<div class="nav-2">
			<div class="flex center">
				<button
					class="filter-btn board-nav-btn flex center"
					@click="toggleFilter"
				>
					<font-awesome-icon
						class="board-nav-icon"
						:icon="['fas', 'filter']"
					/>
					<p class="filte-by-members">{{ filterSelect }}</p>
				</button>
				<div class="board-nav-btn flex center search-container">
					<button class="search-btn" @click="toggleSearch">
						<font-awesome-icon
							class="board-nav-icon search-icon"
							:icon="['fas', 'search']"
						/>
					</button>
					<input
						class="search-input"
						:class="{ 'search-input-hide': !isSearch }"
						type="text"
						ref="search"
						placeholder="Search Task"
						@keydown.enter="emitSearch"
						@input="emitSearch"
					/>
				</div>
			</div>
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
			<div class="board-nav-tools">
				<board-member
					@removeBoardMember="removeBoardMember"
					@addBoardMember="addBoardMember"
					:boardMembers="members"
				/>
				<button
					@click="openBackground"
					class="board-nav-btn background-btn icon-container"
				>
					<font-awesome-icon
						class="board-nav-icon"
						:icon="['fas', 'paint-roller']"
					/>
				</button>
				<button
					@click="openDashboard"
					class="board-nav-btn icon-container"
				>
					<font-awesome-icon
						class="board-nav-icon"
						:icon="['fas', 'chart-bar']"
					/>
				</button>
				<div class="board-nav-btn flex center icon-container">
					<button
						v-if="menu"
						@click="closeMenu"
						class="close-menu-btn times"
					>
						<font-awesome-icon
							class="board-nav-icon"
							:icon="['fas', 'times']"
						/>
					</button>
					<button v-if="!menu" @click="openMenu" class="">
						<font-awesome-icon
							class="settings-icon board-nav-icon"
							:icon="['fas', 'sliders-h']"
						/>
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
	</div>
</template>



<script>
import boardMember from "./board-member.cmp";
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
			menu: null,
			isBacground: false,
			nameToEdit: null,
			isDashboeard: false,
			filterBy: "",
			filterSelect: "All Members",
			isFilterOpts: false,
			isSearch: false,
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
		},
		closeMenu() {
			this.menu = null;
			this.$emit("toggleMenu", this.menu);
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
		toggleSearch() {
			this.isSearch = !this.isSearch;
			if (this.isSearch) this.$refs.search.focus();
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