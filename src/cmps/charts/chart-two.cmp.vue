<script>
import { Doughnut } from "vue-chartjs";


export default {
  name: "chart-two",
  props: {
    members: Array,
    board: Object,
  },
  extends: Doughnut,
  mounted() {
    this.renderChart({
      labels: this.memberNames,
      datasets: [
        {
          label: "Tasks per member",
          backgroundColor: "#f87979",
          data: this.taskPerMember,
        },
      ],
    });
  },
  computed: {
    memberNames() {
      const names = []
      this.members.forEach(member =>{
        names.push(member.fullName)
      })
      return names
    },
    taskPerMember(){
      const tasksPerMember = []
      this.members.forEach(member =>{
        tasksPerMember.push({id: member._id, tasks: 0})
      })
      this.board.lists.forEach(list=>{
        list.tasks.forEach(task =>{
          task.members.forEach(memberId =>{
            var idx = tasksPerMember.findIndex(taskPerMember => memberId === taskPerMember.id )
            tasksPerMember[idx].tasks++
          })
        })
      })
      const tasksCount = tasksPerMember.map(taskPerMember => taskPerMember.tasks)
      return tasksCount
    }
  },
  created() {
  },
};
</script>