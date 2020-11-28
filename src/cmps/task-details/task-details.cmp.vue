<template>
	<div class="task-editor-container" @click="closeDetails">
		<div @click.stop class="task-editor">
			<div class="task-header">
				<h2
					contenteditable
					v-text="taskToEdit.name"
					@blur="updateTaskName"
				>
					{{ task.name }}
				</h2>
				<button @click.stop="closeDetails">X</button>
			</div>
			<div class="task-editor-main">
				<vue-scroll class="vuescroll" :ops="ops">
					<div class="task-details">
						<div>
							<h3>Description</h3>
							<textarea
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
								<li
									v-for="member in membersToShow"
									:key="member._id"
								>
									<img class="avatar" :src="member.imgUrl" />
								</li>
							</ul>
						</div>
						<taskDetailsAttachments
							:attachments="task.attachments"
							@removeAttachment="removeAttachment"
							@setPreviewImg="setPreviewImg"
							@removePreviewImg="removePreviewImg"
						/>
						<taskDetailsChecklists
							:checkLists="task.checkLists"
							@addItem="addItem"
							@removeItem="removeItem"
							@toggleCheck="toggleCheck"
						/>
						<taskDetailsComments
							:comments="task.comments"
							@addComment="addComment"
						/>
						<div>
							<h3>Activity</h3>
							<div
								v-for="(activity, idx) in taskActivites"
								:key="idx"
							>
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
						:is="cmpType"
						@taskUpdate="updateTask"
						@closePopup="closePopup"
					/>
					<button
						class="side-bar-btn"
						@click="openPopup('checkList')"
					>
						CheckList
					</button>
					<button class="side-bar-btn" @click="openPopup('members')">
						Members
					</button>
					<button class="side-bar-btn" @click="openPopup('dueDate')">
						dueDate
					</button>
					<label for="file-upload">
						<button class="side-bar-btn">Add Attachments</button>
						<input
							id="file-upload"
							type="file"
							@change="onUploadImg"
						/>
					</label>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

import checkList from '../task-popups/checkList.cmp';
import members from '../task-popups/members.cmp';
import dueDate from '../task-popups/dueDate.cmp';
import taskDetailsChecklists from '../task-details/task-details-checklists.cmp';
import taskDetailsComments from '../task-details/task-details-comments.cmp';
import taskDetailsAttachments from '../task-details/task-details-attachments.cmp';
import { uploadImg } from '../../services/img-upload.service.js';


export default {
	name: "task-details",
	props: {
		task: Object,
		activites: Array,
		members: Array
	},
	data() {
		return {
			taskToEdit: null,
			isPopup: false,
			cmpType: '',
			ops: {
				scrollPanel: {},
				rail: {
          background: '#92848421',
					size: '20px',
					opacity: 0.1,
				},
				bar: {
					onlyShowBarOnScroll: false,
					keepShow: true,
					background: 'aliceblue',
					size: '15px',
					opacity: 1,
					minSize: 0
        },
			}
		};
	},
	methods: {
		removePreviewImg() {
			this.$emit('removePreviewImg');
		},
		setPreviewImg(idx) {
			this.$emit('setPreviewImg', idx);
		},
		closeDetails() {
			this.$emit("close");
		},
		async onUploadImg(ev) {
			this.isLoading = true;
			const res = await uploadImg(ev);
			// this.signupCred.imgUrl = res.url;
			this.$emit('updateTask', {
				type: 'UploadImg',
				value: res.url
			});
		},
		updateTaskName(evt) {
			var src = evt.target.innerText;
			this.taskToEdit.name = src;
			this.$emit('updateTask', {
				type: 'updateTaskName',
				value: this.taskToEdit
			});
		},
		updateTaskDesc() {
			this.$emit('updateTask', {
				type: 'updateTaskDesc',
				value: this.taskToEdit
			});
		},
		updateTask(updates) {
			if (updates.type === 'checkList') {
				var newCheckList = {
					type: updates.type,
					title: updates.value,
					items: []
				};
				this.$emit('updateTask', newCheckList);
				this.closePopup();
			}
			if (updates.type === 'addMemberToTask') {
				this.$emit('updateTask', updates);
			}
			if (updates.type === 'removeMemberToTask') {
				this.$emit('updateTask', updates);
			}
			if (updates.type === 'updateDueDate') {
				this.$emit('updateTask', updates);
			}
			// else{
			//     this.$emit('updateTask', updates)
			// }
		},
		addComment(commentTxt) {
      console.log('dets',commentTxt);
			this.$emit('addComment', commentTxt);
		},
		addItem(itemInfo) {
			const item = {
				checkListIdx: itemInfo.checkListIdx,
				txt: itemInfo.txt,
				isDone: false
			};
			this.$emit('addItem', item);
		},
		removeItem(idxs) {
			console.log("details", idxs.checkListIdx, idxs.itemIdx);
			this.$emit('removeItem', idxs);
		},
		toggleCheck(idxs) {
			console.log(idxs);
			this.$emit('toggleCheck', idxs);
		},
		removeAttachment(idx) {
			this.$emit('removeAttachment', idx);
		},
		openPopup(type) {
			console.log(type);
			this.cmpType = type,
				this.isPopup = true;
		},
		closePopup() {
			this.cmpType = '',
				this.isPopup = false;
		}
	},
	computed: {
		taskActivites() {
			return this.activites.filter(activity => activity.taskId === this.task.id);
		},
		membersToShow() {
			var toShow = [];
			this.task.members.forEach(memberId => {
				this.members.forEach(member => {
					if (memberId === member._id) {
						toShow.push(member);
					}
				});
			});
			return toShow;
		}
	},
	components: {
		checkList,
		members,
		dueDate,
		taskDetailsChecklists,
		taskDetailsComments,
		taskDetailsAttachments
	},
	created() {
		this.taskToEdit = JSON.parse(JSON.stringify(this.task));
	},
};
</script>