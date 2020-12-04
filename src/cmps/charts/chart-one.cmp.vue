<script>
import { Bar } from "vue-chartjs";

export default {
  name: "chart-one",
  props: {
    board: Object
  },
  extends: Bar,
  mounted() {
    this.renderChart({
      labels: this.listsName,
      datasets: [
        {
          label: "Tasks per list",
          backgroundColor: ["#A6F4E8","#6FBCB0","#FEE2B3","#665D4E","#B5AA99","#007664",],
          data: this.TasksPerLists,
        },
      ],
    });
  },
  computed:{
    listsName(){
      var names = []
      this.board.lists.forEach(list => {
        names.push(list.name)
      });
      return names
    },
    TasksPerLists(){
      var tasks = []
      this.board.lists.forEach(list => {
        tasks.push(list.tasks.length)
      });
      return tasks
    }
  }
};
</script>