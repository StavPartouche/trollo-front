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
          // backgroundColor: ["#a7846c","#767478","#fee2b3"],
          // backgroundColor: ["#a7846c","#f6742b","#00ada7","#39a542","#ea474c"],
          // backgroundColor: ["#FEE2B3","#665D4E","#B5AA99","#A6F4E8","#6FBCB0","#007664"],
          backgroundColor: ["#A6F4E8","#6FBCB0","#FEE2B3","#665D4E","#B5AA99","#007664",],
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
            if (idx >= 0) tasksPerMember[idx].tasks++
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