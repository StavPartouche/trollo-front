<template>
  <div class="dashboard">
    <button class="exit-btn" @click="closeDashbord"><font-awesome-icon class="data-card-icon" :icon="['fas', 'times']" /></button>
    <div class="dashboard-data flex">
      <div class="data-card">
        <font-awesome-icon class="data-card-icon" :icon="['fas', 'user']" />
        <div class="data-card-details">
          <h3>{{ membersCount }}</h3>
          <p>Members</p>
        </div>
      </div>
      <div class="data-card">
        <font-awesome-icon class="data-card-icon" :icon="['fas', 'file-alt']" />
        <div class="data-card-details">
          <h3>{{totalTasksCount}}</h3>
          <p>Total tasks</p>
        </div>
      </div>
      <div class="data-card">
        <font-awesome-icon class="data-card-icon" :icon="['fas', 'times']" />
        <div class="data-card-details">
          <h3>{{unassingnedTasksCount}}</h3>
          <p>Unassingned Tasks</p>
        </div>
      </div>
      <div class="data-card">
        <font-awesome-icon class="data-card-icon" :icon="['fas', 'hand-pointer']" />
        <div class="data-card-details">
          <h3>{{activitiesCount}}</h3>
          <p>Activities</p>
        </div>
      </div>
    </div>
    <div class="charts">
      <div class="charts-top">
         <div class="chart">
           <chart-one :board="board"/>
      </div>
        <div class="chart chart-doughnut">
            <chart-three :board="board"/>
            
        </div>
      </div>
      <div class="chart-bar  flex center">
        <chart-two :board="board" :members="members"/>
        </div>
    </div>
  </div>
</template>

<script>

import chartOne from './charts/chart-one.cmp'
import chartTwo from './charts/chart-two.cmp'
import chartThree from './charts/chart-three.cmp'

export default {
  name: "dashboard",
  props: {
    members: Array,
    board: Object,
  },
  data() {
    return {};
  },
  methods: {
    closeDashbord() {
      this.$emit("closeDashbord");
    },
  },
  computed: {
    membersCount() {
      return this.members.length;
    },
    totalTasksCount() {
      var count = this.board.lists.reduce((acc, list) => {
        acc += list.tasks.length
        return acc;
      }, 0);
      return count;
    },
    unassingnedTasksCount(){
        var count = this.board.lists.reduce((acc, list) => {
        list.tasks.forEach(task => {
            if(task.members.length === 0){
                acc++
            }
        })
        return acc;
      }, 0);
      return count;
    },
    activitiesCount(){
        return this.board.activities.length
    }
  },
  components:{
      chartOne,
      chartTwo,
      chartThree
  },
  created(){
      
  }
};
</script>