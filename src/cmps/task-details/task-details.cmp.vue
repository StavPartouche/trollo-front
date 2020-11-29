<template>
  <div class="task-editor-container" @click="closeDetails">
        <div
      @click.stop="closePopup"
      :class="{ 'hide': !isPopup, 'disable-page-container': isPopup }"
    ></div>
    <div @click.stop class="task-editor">
      <div class="task-header">
        <h2 contenteditable v-text="taskToEdit.name" @blur="updateTaskName">
          {{ task.name }}
        </h2>
        <button @click.stop="closeDetails">X</button>
      </div>
      <div class="task-editor-main">
        <vue-scroll class="vuescroll" :ops="ops">
          <div class="task-details">
            <task-details-labels :labels="task.labels"/>
            <div>
              <h3>Description</h3>
              <textarea
                class="description-textarea"
                contenteditable
                v-model="taskToEdit.description"
                @blur="updateTaskDesc"
                cols="30"
                rows="5"
              ></textarea>
            </div>
            <div v-if="task.dueDate">
              <h3>Due Date</h3>
              <p>{{ task.dueDate }}</p>
            </div>
            <div v-if="membersToShow.length">
              <h3>members</h3>
              <ul class="flex">
                <li v-for="member in membersToShow" :key="member._id">
                  <user-avatar :user="member"></user-avatar>
                </li>
              </ul>
            </div>
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
            <taskDetailsComments
              :comments="task.comments"
              @addComment="addComment"
            />
            <div>
              <h3>Activity</h3>
              <div v-for="(activity, idx) in taskActivites" :key="idx">
                <h4>By: {{ activity.userId }}</h4>
                <p>{{ activity.txt }}</p>
              </div>
            </div>
          </div>
        </vue-scroll>
        <div class="side-bar">
          <component
            v-if="isPopup"
            :taskMembersIds="task.members"
            :boardMembers="members"
            :labels="labels"
            :is="cmpType"
            @taskUpdate="updateTask"
            @closePopup="closePopup"
            @toggleLabel="toggleLabel"
            @setTaskColor="setTaskColor"
          />
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
          <button class="side-bar-btn delete-task-btn" @click="removeTask()">
            Delete Task
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import checkList from "../task-popups/checkList.cmp";
import members from "../task-popups/members.cmp";
import dueDate from "../task-popups/dueDate.cmp";
import labels from '../task-popups/labels.cmp';
import backgroundColor from '../task-popups/backgroundColor.cmp'
import taskDetailsChecklists from "../task-details/task-details-checklists.cmp";
import taskDetailsComments from "../task-details/task-details-comments.cmp";
import taskDetailsAttachments from "../task-details/task-details-attachments.cmp";
import taskDetailsLabels from '../task-details/task-details-labels.cmp'
import { uploadImg } from "../../services/img-upload.service.js";
import userAvatar from "../user-avatar.cmp";
import taskDetailsLabelsCmp from './task-details-labels.cmp.vue';

export default {
  name: "task-details",
  props: {
    task: Object,
    activites: Array,
    members: Array,
    labels:Array
  },
  data() {
    return {
      taskToEdit: null,
      isPopup: false,
      cmpType: "",
      ops: {
        scrollPanel: {},
        rail: {
          background: "#92848421",
          size: "20px",
          opacity: 0.1,
        },
        bar: {
          onlyShowBarOnScroll: false,
          keepShow: true,
          size: "15px",
          opacity: 1,
          minSize: 0,
        },
      },
    };
  },
  methods: {
    removeTask(){
      const isSure = confirm('are you sure?')
      if(isSure) this.$emit('removeTask')
    },
    setTaskColor(bgc){
      console.log(bgc);
      this.$emit('setTaskColor', bgc)
    },
    toggleLabel(label){
      this.$emit('toggleLabel', label)
    },
	  removeCheckList(idx){
		  this.$emit('removeCheckList', idx)
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
      // this.signupCred.imgUrl = res.url;
      this.$emit("updateTask", {
        type: "UploadImg",
        value: res.url,
      });
    },
    updateTaskName(evt) {
      var src = evt.target.innerText;
      this.taskToEdit.name = src;
      this.$emit("updateTask", {
        type: "updateTaskName",
        value: this.taskToEdit,
      });
    },
    updateTaskDesc() {
      this.$emit("updateTask", {
        type: "updateTaskDesc",
        value: this.taskToEdit,
      });
    },
    updateTask(updates) {
      if (updates.type === "checkList") {
        var newCheckList = {
          type: updates.type,
          title: updates.value,
          items: [],
        };
        this.$emit("updateTask", newCheckList);
        this.closePopup();
      }
      if (updates.type === "addMemberToTask") {
        this.$emit("updateTask", updates);
      }
      if (updates.type === "removeMemberToTask") {
        this.$emit("updateTask", updates);
      }
      if (updates.type === "updateDueDate") {
        this.$emit("updateTask", updates);
      }
      // else{
      //     this.$emit('updateTask', updates)
      // }
    },
    addComment(commentTxt) {
      console.log("dets", commentTxt);
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
      (this.cmpType = type), (this.isPopup = true);
    },
    closePopup() {
      console.log('close popup');
      (this.cmpType = ""), (this.isPopup = false);
    },
    onKeyUp(ev) {
      if (ev.keyCode === 27) {
        if (this.isPopup) this.closePopup();
        else this.closeDetails();
      }
    },
  },
  computed: {
    taskActivites() {
      return this.activites.filter(
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
    userAvatar
  },
  created() {
    this.taskToEdit = JSON.parse(JSON.stringify(this.task));
    document.body.addEventListener("keyup", this.onKeyUp);
    // console.log('this.task',this.task.labels);
  },
  destroyed() {
    document.body.removeEventListener("keyup", this.onKeyUp);
  },
};
</script>