<template>
  <div class="task-editor-container" @click="closeDetails">
    <div @click.stop class="task-editor">
        <div class="task-header">
            <h2>{{ task.name }}</h2>
            <button @click.stop="closeDetails">X</button>
        </div>
        <div class="task-editor-main">
            <div class="task-details">
                <div>
                    <h3>Description</h3>
                    <p>{{task.description}}</p>
                </div>
                <div>
                    <h3>Attachments</h3>
                    <img v-for="(attachment,idx) in task.attachments" :key="idx" :src="attachment"/>
                </div>
                <div>
                    <h3>Check Lists</h3>
                    <div v-for ="(checkList, checkListIdx) in task.checkLists" :key="checkListIdx">
                         <h4>{{checkList.title}}</h4>
                         <ul>
                             <li v-for="(item,idx) in checkList.items" :key="idx">
                                 {{item.txt}}
                             </li>
                         </ul>
                         <form  @submit.prevent="addItem(checkListIdx)">
                            <input type="text" v-model="newItem">
                            <button>add to list</button>
                         </form>
                     </div>
                </div>
                <div>
                    <h3>Comments</h3>
                     <div v-for="(comment,idx) in task.comments" :key= idx>
                         <h4>By: {{comment.creator}}</h4>
                         <p>{{comment.txt}}</p>
                     </div>
                </div>
                <div>
                    <h3>Activity</h3>
                     <div v-for="(activity,idx) in taskActivites" :key= idx>
                         <h4>By: {{activity.userId}}</h4>
                         <p>{{activity.txt}}</p>
                     </div>
                </div>
            </div>
            <div class="side-bar">
                <component v-if="isPopup" :is="cmpType" @taskUpdate="updateTask"/>
                <button @click="openPopup('checkList')">Add CheckList</button>
            </div>
        </div>
    </div>
  </div>
</template>

<script>

import checkList from '../cmps/task-popups/checkList.cmp'

export default {
  name: "task-details",
  props: {
    task: {
      type: Object,
    },
    activites:{
        type: Array
    }
  },
  data() {
    return {
        isPopup: false,
        cmpType: '',
        newItem:''
    };
  },
  methods: {
    closeDetails() {
      this.$emit("close");
    },
    updateTask(updates){
        if(updates.type === 'checkList'){
            var newCheckList = {
                type: updates.type,
                title: updates.value,
                items:[]
            }
            this.$emit('updateTask', newCheckList)
        }
    },
    addItem(checkListIdx){
        console.log(checkListIdx);
        const item = {
            checkListIdx: checkListIdx,
            txt: this.newItem,
            isDone: false
        }
        this.$emit('addItem', item)
        this.newItem = ''
    },
    openPopup(type){
        this.cmpType = type,
        this.isPopup = true
    }
  },
  computed: {
      taskActivites(){
          return this.activites.filter(activity => activity.taskId === this.task.id)
      }
  },
  components:{
      checkList
  },
  created() {

  },
};
</script>