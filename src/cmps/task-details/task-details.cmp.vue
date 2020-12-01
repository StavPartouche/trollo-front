<template>
  <div class="task-editor-container" @click="closeDetails">
        <!-- <div
      @click.stop="closePopup"
      :class="{ 'hide': !isPopup, 'disable-page-container': isPopup }"
    ></div> -->
    <div @click.stop class="task-editor">
		<div
      @click="closePopup"
      v-if="isPopup"
      class="disable-page-container"
      :style="{ 'z-index': 1 }"
    ></div>
      <div class="task-header">
        <h2 contenteditable v-text="taskToEdit.name" @blur="updateTaskName">
          {{ task.name }}
        </h2>
        <button @click.stop="closeDetails">X</button>
      </div>
      <div class="task-editor-main">
          <div class="task-details">
            <task-details-labels :labels="task.labels"/>
            <div>
              <h3>Description</h3>
              <textarea
                class="description-textarea data-layout"
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
              <ul class="flex data-layout">
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
              <div v-for="(activity, idx) in taskActivities" :key="idx">
                <h4>By: {{ activity.userId }}</h4>
                <p>{{ activity.txt }}</p>
              </div>
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
        <div class="side-bar-container flex-column justify-space-between">
          <div class="side-bar">
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
          </div>
          <button class="side-bar-btn delete-task-btn" @click="openWarning">
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
import backgroundColor from '../task-popups/backgroundColor.cmp';
import taskDetailsChecklists from "../task-details/task-details-checklists.cmp";
import taskDetailsComments from "../task-details/task-details-comments.cmp";
import taskDetailsAttachments from "../task-details/task-details-attachments.cmp";
import taskDetailsLabels from '../task-details/task-details-labels.cmp';
import { uploadImg } from "../../services/img-upload.service.js";
import userAvatar from "../user-avatar.cmp";
import taskDetailsLabelsCmp from './task-details-labels.cmp.vue';
import { eventBusService } from "../../services/eventBus.service";


export default {
	name: "task-details",
	props: {
		task: Object,
		activities: Array,
		members: Array,
		labels: Array
	},
	data() {
		return {
			taskToEdit: null,
			isPopup: false,
			cmpType: "",
		};
	},
	methods: {
		removeTask() {
			this.$emit('removeTask');
		},
		setTaskColor(bgc) {
			this.$emit('setTaskColor', bgc);
		},
		toggleLabel(label) {
			this.$emit('toggleLabel', label);
		},
		removeCheckList(idx) {
			this.$emit('removeCheckList', idx);
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
			this.cmpType = type
			this.isPopup = true
			// eventBusService.$emit("disablePage", { to: "popup", zIndex: 4 });
		},
		closePopup() {
			this.cmpType = "" 
			this.isPopup = false
		},
		onKeyUp(ev) {
			if (ev.keyCode === 27) {
				if (this.isPopup) this.closePopup();
				else this.closeDetails();
			}
		},
		openWarning() {
			this.$confirm('This will permanently delete the task. Continue?', 'Warning', {
				confirmButtonText: 'Delete',
				cancelButtonText: 'Cancel',
				type: 'warning'
			}).then(() => {
				this.removeTask();
				this.$message({
					type: 'success',
					message: 'Delete completed'
				});
			}).catch(() => {
				this.$message({
					type: 'info',
					message: 'Delete canceled'
				});
			});
		}
	},
	watch: {
		'task.name'() {
			this.taskToEdit.name = this.task.name;
		},
		'task.description'() {
			this.taskToEdit.description = this.task.description;
		}
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
		// eventBusService.$on("disablePage-popup", this.closePopup);
	},
	destroyed() {
		document.body.removeEventListener("keyup", this.onKeyUp);
		// eventBusService.$off("disablePage-popup");
	},
};
</script>