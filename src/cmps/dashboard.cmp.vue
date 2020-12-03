<template>
  <div class="dashboard">
    <div class="dashboard-data flex">
      <div class="data-card">
        <p>icon</p>
        <div>
          <h3>{{ membersCount }}</h3>
          <h3>Members</h3>
        </div>
      </div>
      <div class="data-card">
        <p>icon</p>
        <div>
          <h3>{{totalTasksCount}}</h3>
          <h3>Total tasks</h3>
        </div>
      </div>
      <div class="data-card">
        <p>icon</p>
        <div>
          <h3>{{unassingnedTasksCount}}</h3>
          <h3>Unassingned Tasks</h3>
        </div>
      </div>
      <div class="data-card">
        <p>icon</p>
        <div>
          <h3>{{activitiesCount}}</h3>
          <h3>Activities</h3>
        </div>
      </div>
      <button @click="closeDashbord">X</button>
    </div>
    <div class="charts">
        <div class="chart">
            <chart-one :board="board"/>
        </div>
        <div class="chart">
            <chart-two :board="board" :members="members"/>
        </div>
        <div class="chart">
            <chart-three />
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
      console.log(this.board);
  }
};
</script>