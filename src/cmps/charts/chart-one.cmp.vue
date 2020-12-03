<script>
import { Bar } from "vue-chartjs";

export default {
  name: "chart-one",
  props: {
    board: Object
  },
  extends: Bar,
  mounted() {
    // Overwriting base render method with actual data.
    this.renderChart({
      labels: this.listsName,
      datasets: [
        {
          label: "Tasks pre list",
          backgroundColor: "#f87979",
          data: this.TasksPreLists,
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
    TasksPreLists(){
      var tasks = []
      this.board.lists.forEach(list => {
        tasks.push(list.tasks.length)
      });
      return tasks
    }
  }
};
</script>