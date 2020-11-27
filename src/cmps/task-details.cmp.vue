<template>
  <div class="task-editor-container" @click="closeDetails">
    <div @click.stop class="task-editor">
      <div class="task-header">
        <h2 contenteditable v-text="taskToEdit.name" @blur="updateTaskName">
          {{ task.name }}
        </h2>
        <button @click.stop="closeDetails">X</button>
      </div>
      <div class="task-editor-main">
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
              <li v-for="member in membersToShow" :key="member._id">
                <img class="avatar" :src="member.imgUrl" />
              </li>
            </ul>
          </div>
          <div>
            <h3>Attachments</h3>
            <img
              v-for="(attachment, idx) in task.attachments"
              :key="idx"
              :src="attachment"
            />
          </div>
          <taskDetailsChecklists
            :checkLists="task.checkLists"
            @addItem="addItem"
            @removeItem="removeItem"
          />
          <div>
            <h3>Comments</h3>
            <div v-for="(comment, idx) in task.comments" :key="idx">
              <h4>By: {{ comment.creator }}</h4>
              <p>{{ comment.txt }}</p>
            </div>
          </div>
          <div>
            <h3>Activity</h3>
            <div v-for="(activity, idx) in taskActivites" :key="idx">
              <h4>By: {{ activity.userId }}</h4>
              <p>{{ activity.txt }}</p>
            </div>
          </div>
        </div>
        <div class="side-bar">
          <component
            v-if="isPopup"
            :taskMembersIds="task.members"
            :boardMembers="members"
            :is="cmpType"
            @taskUpdate="updateTask"
            @closePopup="closePopup"
          />
          <button class="side-bar-btn" @click="openPopup('checkList')">
            CheckList
          </button>
          <button class="side-bar-btn" @click="openPopup('members')">
            Members
          </button>
          <button class="side-bar-btn" @click="openPopup('dueDate')">
            dueDate
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import checkList from '../cmps/task-popups/checkList.cmp'
import members from '../cmps/task-popups/members.cmp'
import dueDate from '../cmps/task-popups/dueDate.cmp'
import taskDetailsChecklists from '../cmps/task-details-checklists.cmp'

export default {
  name: "task-details",
  props: {
    task: Object,
    activites:Array,
    members: Array
  },
  data() {
    return {
        taskToEdit: null,
        isPopup: false,
        cmpType: ''
    };
  },
  methods: {
    closeDetails() {
      this.$emit("close");
    },
    updateTaskName(evt){
             var src = evt.target.innerText
             this.taskToEdit.name = src
             this.$emit('updateTask', {
                 type: 'updateTaskName',
                 value: this.taskToEdit
             })
    },
    updateTaskDesc(){
                this.$emit('updateTask', {
                 type: 'updateTaskDesc',
                 value: this.taskToEdit
             })
    },
    updateTask(updates){
        if(updates.type === 'checkList'){
            var newCheckList = {
                type: updates.type,
                title: updates.value,
                items:[]
            }
            this.$emit('updateTask', newCheckList)
            this.closePopup()
        }
        if(updates.type === 'addMemberToTask'){
            this.$emit('updateTask', updates)
        }
        if(updates.type === 'removeMemberToTask'){
            this.$emit('updateTask', updates)
        }
        if(updates.type === 'updateDueDate'){
            this.$emit('updateTask', updates)
        }
        // else{
        //     this.$emit('updateTask', updates)
        // }
    },
    addItem(itemInfo){
        const item = {
            checkListIdx: itemInfo.checkListIdx,
            txt: itemInfo.txt,
            isDone: false
        }
        this.$emit('addItem', item)
    },
    removeItem(idxs){
        console.log("details",idxs.checkListIdx, idxs.itemIdx)
        this.$emit('removeItem', idxs)
    },
    openPopup(type){
        this.cmpType = type,
        this.isPopup = true
    },
    closePopup(){
        this.cmpType = '',
        this.isPopup = false
    }
  },
  computed: {
      taskActivites(){
          return this.activites.filter(activity => activity.taskId === this.task.id)
      },
      membersToShow(){
          var toShow = []
          this.task.members.forEach(memberId => {
              this.members.forEach(member => {
                  if(memberId === member._id){
                      toShow.push(member)
                  }
              })
          })
          return toShow
      }
  },
  components:{
      checkList,
      members,
      dueDate,
      taskDetailsChecklists
  },
  created() {
      this.taskToEdit = JSON.parse(JSON.stringify(this.task))
      console.log('taskToEdit', this.taskToEdit);
  },
};
</script>