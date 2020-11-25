<template>
  <div class="task-editor-container" @click="closeDetails">
    <div class="task-editor">
        <div class="task-header">
            <h2>{{ task.name }}</h2>
            <button @click="closeDetails">X</button>
        </div>
        <div class="task-editor-main">
            <div class="task-details">
                <div>
                    <h3>Description</h3>
                    <p>{{task.description}}</p>
                </div>
                <div>
                    <h3>Attachments</h3>
                    <img v-for="(attachment,idx) in task.attachments" :key= idx :src="attachment"/>
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
                
            </div>
        </div>
    </div>
  </div>
</template>

<script>
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
    return {};
  },
  methods: {
    closeDetails() {
      this.$emit("close");
    },
  },
  computed: {
      taskActivites(){
          return this.activites.filter(activity => activity.taskId === this.task.id)
      }
  },
  created() {
      console.log(this.task.id);
      console.log(this.activites);
  },
};
</script>