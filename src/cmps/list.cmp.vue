<template>
  <section>
    <div class="list-header-container flex justify-space-between align-center">
      <h2
        class="list-header"
        contenteditable
        @blur="updateListName"
        v-text="listName"
        :id="'list'+listIdx"
      >
        {{ list.name }}
      </h2>
      <button class="list-edit-btn" @click="toggleListEdit">
        <i class="fas fa-ellipsis-v"></i>
      </button>
      <list-edit-menu
        v-if="isListEdit"
        :listIdx="listIdx"
        @removeList="removeList"
        @toggleAdd="toggleAdd"
		@toggleListEdit="toggleListEdit"
      />
    </div>
    <ul>
      <draggable
        :list="list.tasks"
        group="tasks"
        :move="tiltCard"
        v-bind="dragOptions"
        @sort="emitUpdateList"
      >
        <li
          class="task-preview"
          v-for="(task, taskIdx) in list.tasks"
          :key="taskIdx"
          @click="openTask(listIdx, taskIdx)"
          :style="{ backgroundColor: task.backgroundColor }"
        >
          <ul class="flex">
            <li v-for="(label, idx) in task.labels" :key="idx">
              <div
                class="label-preview"
                :style="{ backgroundColor: label.backgroundColor }"
              ></div>
            </li>
          </ul>
          <div
            class="task-preview-header flex align-center justify-space-between"
          >
            <h4>{{ task.name }}</h4>
          </div>
          <img
            class="preview-img"
            v-if="task.previewImg"
            :src="task.previewImg"
          />
          <ul class="flex" v-if="task.members.length">
            <li v-for="memberId in task.members" :key="memberId">
              <user-avatar :user="getMemberById(memberId)"></user-avatar>
            </li>
          </ul>
        </li>
      </draggable>
    </ul>
    <button v-if="!isAddInput" class="add-task-btn" @click="toggleAdd">
      + Add task
    </button>
    <add-item-input class="add-item-input" id="add-task-input" v-else @add="addTask(listIdx, $event)" />
  </section>
</template>

<script>
import draggable from "vuedraggable";
import userAvatar from "./user-avatar.cmp";
import addItemInput from "./add-item-input.cmp";
import listEditMenu from "./list-edit-menu.cmp";
export default {
  name: "list",
  props: {
    list: Object,
    listIdx: Number,
    members: Array,
  },
  data() {
    return {
      isAddInput: false,
      isListEdit: false,
      listName: null,
    };
  },
  methods: {
    toggleListEdit() {
      this.isListEdit = !this.isListEdit;
      this.$emit('toggleDisable')
    },
    updateListName(evt) {
      var src = evt.target.innerText;
      this.listName = src;
      this.$emit("updateListName", {
        newName: this.listName,
        listIdx: this.listIdx,
      });
    },
    toggleAdd() {
      this.isAddInput = !this.isAddInput;
    },
    getMemberById(id) {
      const arr = this.members.filter((member) => member._id === id);
      if (!arr.length) return;
      return arr[0];
    },
    openTask(listIdx, taskIdx) {
      this.$emit("openTask", {
        listIdx,
        taskIdx,
      });
    },
    addTask(listIdx, itemTxt) {
      if (itemTxt === "") {
        this.toggleAdd();
        return;
      }
      this.$emit("addTask", {
        listIdx,
        title: itemTxt,
      });
      this.toggleAdd();
    },
    removeList(listIdx) {
      this.toggleListEdit();
      this.$emit("removeList", listIdx);
    },
    emitUpdateList() {
      this.$emit("updateList", this.list);
    },
    tiltCard(ev) {
      // console.log(ev)
      // console.log(ev.dragged)
      // ev.dragged.classList.add('tilt');
      // ev.item.classList.toggle('tilt');
    },
  },
  computed: {
    dragOptions() {
      return {
        animation: 300,
        group: "tasks",
        disabled: false,
        ghostClass: "ghost",
      };
    },
  },
  components: {
    draggable,
    userAvatar,
    addItemInput,
    listEditMenu,
  },
  created() {
    this.listName = this.list.name;
  },
};
</script>