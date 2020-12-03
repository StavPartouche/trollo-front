<template>
  <div @click.stop class="task-editor flex-column">
    <div
      @click="closePopup"
      v-if="isPopup"
      class="disable-page-container"
      :style="{ 'z-index': 1 }"
    ></div>
    <button  @click.stop="closeDetails" class="close-details-btn">
      <font-awesome-icon :icon="['fas', 'times']" />
    </button>
    <h2
      class="task-header flex"
      contenteditable
      v-text="taskToEdit.name"
      @blur="updateTaskName"
    >
      {{ task.name }}
    </h2>
    <div v-if="task.dueDate">
        <p>{{ task.dueDate }}</p>
    </div>
    <div class="task-editor-main flex">
      <div class="task-details flex-column">
          <div v-if="membersToShow.length">
            <ul class="flex data-layout">
              <li v-for="member in membersToShow" :key="member._id">
                <user-avatar :user="member"></user-avatar>
              </li>
            </ul>
          </div>
        <task-details-labels v-if="task.labels" :labels="task.labels" />
        <div>
          <h3><font-awesome-icon class="task-preview-data-item-icon" :icon="['fas', 'align-left']" /> Description</h3>
          <textarea
            placeholder="Describe here..."
            class="description-textarea data-layout"
            contenteditable
            v-model="taskToEdit.description"
            @blur="updateTaskDesc"
            cols="80"
            rows="6"
          ></textarea>
        </div>
        <!-- <div v-if="task.dueDate">
          <h3>Due Date</h3>
          <p>{{ task.dueDate }}</p>
        </div> -->

        <taskDetailsAttachments
          :attachments="task.attachments"
          :previewImg="task.previewImg"
          @removeAttachment="removeAttachment"
          @setPreviewImg="setPreviewImg"
          @removePreviewImg="removePreviewImg"
        />
        <taskDetailsChecklists
          :checkLists="task.checkLists"
          @addItem="addItem"
          @removeItem="removeItem"
          @toggleCheck="toggleCheck"
          @removeCheckList="removeCheckList"
        />
        <div class="show-controller">
          <button :class="activeCommetns" @click="showComments">Comments</button>
          <button :class="activeActivities" @click="showActivities">Activities</button>
        </div>
        <taskDetailsComments
          v-if="isComments"
          :comments="task.comments"
          @addComment="addComment"
        />
        <div v-if="isActivities" class="activity-task-container flex-column">
          <h3><font-awesome-icon :icon="['fas', 'history']" /> Activity</h3>
          <ul class="activity-task">
            <board-activity
              v-for="(activity, idx) in taskActivities"
              :key="idx"
              :activity="activity"
            />
          </ul>
        </div>
      </div>
      <component
        v-if="isPopup"
        :taskMembersIds="task.members"
        :boardMembers="members"
        :labels="labels"
        :is="cmpType"
        @addCheckList="addCheckList"
        @addMemberToTask="addMemberToTask"
        @removeMemberfromTask="removeMemberfromTask"
        @updateDueDate="updateDueDate"
        @closePopup="closePopup"
        @toggleLabel="toggleLabel"
        @setTaskColor="setTaskColor"
      />
      <div class="side-bar-container flex-column">
        <p class="side-bar-p">Add To This Task</p>
        <button class="side-bar-btn" @click="openPopup('checkList')">
          CheckList
        </button>
        <button class="side-bar-btn" @click="openPopup('labels')">
          Labels
        </button>
        <button class="side-bar-btn" @click="openPopup('members')">
          Members
        </button>
        <button class="side-bar-btn" @click="openPopup('dueDate')">
          dueDate
        </button>
        <button class="side-bar-btn" @click="openPopup('backgroundColor')">
          BackgroundColor
        </button>
        <label class="btn side-bar-btn">
          Attachments
          <input
            class="add-attachments-input"
            type="file"
            @change="onUploadImg"
          />
        </label>
                <p class="side-bar-p">More...</p>
        <button class="side-bar-btn weak-btn" @click="copyTask(task)">
          Duplicate
        </button>
        <button class="side-bar-btn weak-btn" @click="openWarning">
          Delete this task
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import checkList from "../task-popups/checkList.cmp";
import members from "../task-popups/members.cmp";
import dueDate from "../task-popups/dueDate.cmp";
import labels from "../task-popups/labels.cmp";
import backgroundColor from "../task-popups/backgroundColor.cmp";
import taskDetailsChecklists from "../task-details/task-details-checklists.cmp";
import taskDetailsComments from "../task-details/task-details-comments.cmp";
import taskDetailsAttachments from "../task-details/task-details-attachments.cmp";
import taskDetailsLabels from "../task-details/task-details-labels.cmp";
import { uploadImg } from "../../services/img-upload.service.js";
import userAvatar from "../user-avatar.cmp";
import taskDetailsLabelsCmp from "./task-details-labels.cmp.vue";
import { eventBusService } from "../../services/eventBus.service";
import boardActivity from "../board-menu/board-activity.cmp";

export default {
  name: "task-details",
  props: {
    task: Object,
    activities: Array,
    members: Array,
    labels: Array,
  },
  data() {
    return {
      taskToEdit: null,
      isPopup: false,
      cmpType: "",
      isComments: true,
      isActivities: false
    };
  },
  methods: {
    showComments(){
      this.isComments = true
      this.isActivities = false
    },
    showActivities(){
      this.isComments = false
      this.isActivities = true
    },
    copyTask(task) {
      this.$emit("addTask", task);
    },
    removeTask() {
      this.$emit("removeTask");
    },
    setTaskColor(bgc) {
      this.$emit("setTaskColor", bgc);
    },
    toggleLabel(label) {
      this.$emit("toggleLabel", label);
    },
    removeCheckList(idx) {
      this.$emit("removeCheckList", idx);
    },
    removePreviewImg() {
      this.$emit("removePreviewImg");
    },
    setPreviewImg(idx) {
      this.$emit("setPreviewImg", idx);
    },
    closeDetails() {
      this.$emit("close");
    },
    async onUploadImg(ev) {
      this.isLoading = true;
      const res = await uploadImg(ev);
      this.$emit("UploadImg", res.url);
    },
    updateTaskName(evt) {
      var src = evt.target.innerText;
      this.$emit("updateTaskName", src);
    },
    updateTaskDesc() {
      this.$emit("updateTaskDesc", this.taskToEdit.description);
    },
    addCheckList(title) {
      var newCheckList = {
        title: title,
        items: [],
      };
      this.$emit("addCheckList", newCheckList);
      this.closePopup();
    },
    addMemberToTask(memberId) {
      this.$emit("addMemberToTask", memberId);
    },
    removeMemberfromTask(memberIdx) {
      this.$emit("removeMemberfromTask", memberIdx);
    },
    updateDueDate(newDate) {
      this.$emit("updateDueDate", newDate);
    },
    addComment(commentTxt) {
      this.$emit("addComment", commentTxt);
    },
    addItem(itemInfo) {
      const item = {
        checkListIdx: itemInfo.checkListIdx,
        txt: itemInfo.txt,
        isDone: false,
      };
      this.$emit("addItem", item);
    },
    removeItem(idxs) {
      this.$emit("removeItem", idxs);
    },
    toggleCheck(idxs) {
      this.$emit("toggleCheck", idxs);
    },
    removeAttachment(idx) {
      this.$emit("removeAttachment", idx);
    },
    openPopup(type) {
      this.cmpType = type;
      this.isPopup = true;
      // eventBusService.$emit("disablePage", { to: "popup", zIndex: 4 });
    },
    closePopup() {
      this.cmpType = "";
      this.isPopup = false;
    },
    onKeyUp(ev) {
      if (ev.keyCode === 27) {
        if (this.isPopup) this.closePopup();
        else this.closeDetails();
      }
    },
    openWarning() {
      this.$confirm(
        "This will permanently delete the task. Continue?",
        "Warning",
        {
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          this.removeTask();
          this.$message({
            type: "success",
            message: "Delete completed",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Delete canceled",
          });
        });
    },
  },
  watch: {
    "task.name"() {
      this.taskToEdit.name = this.task.name;
    },
    "task.description"() {
      this.taskToEdit.description = this.task.description;
    },
  },
  computed: {
    taskActivities() {
      return this.activities.filter(
        (activity) => activity.taskId === this.task.id
      );
    },
    membersToShow() {
      var toShow = [];
      this.task.members.forEach((memberId) => {
        this.members.forEach((member) => {
          if (memberId === member._id) {
            toShow.push(member);
          }
        });
      });
      return toShow;
    },
    activeCommetns(){
      return { active: this.isComments }
    },
    activeActivities(){
      return { active: this.isActivities }
    }
  },
  components: {
    checkList,
    members,
    dueDate,
    labels,
    backgroundColor,
    taskDetailsChecklists,
    taskDetailsComments,
    taskDetailsAttachments,
    taskDetailsLabels,
    userAvatar,
    boardActivity,
  },
  created() {
    this.taskToEdit = JSON.parse(JSON.stringify(this.task));
    document.body.addEventListener("keyup", this.onKeyUp);
    // eventBusService.$on("disablePage-popup", this.closePopup);
  },
  destroyed() {
    document.body.removeEventListener("keyup", this.onKeyUp);
    // eventBusService.$off("disablePage-popup");
  },
};
</script>