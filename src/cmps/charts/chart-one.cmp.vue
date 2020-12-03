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
          backgroundColor: "#f87979",
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