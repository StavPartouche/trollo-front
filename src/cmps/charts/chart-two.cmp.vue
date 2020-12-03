<script>
import { Doughnut } from "vue-chartjs";

export default {
  name: "chart-two",
  props: {
    board: Object,
  },
  extends: Doughnut,
  mounted() {
    // Overwriting base render method with actual data.
    this.renderChart({
      labels: this.members,
      datasets: [
        {
          label: "Tasks pre member",
          backgroundColor: "#f87979",
          data: [1, 1, 1, 1, 1, 1],
        },
      ],
    });
  },
  computed: {
    members() {
      return this.board.members;
    },
  },
  created() {
    console.log(this.board);
  },
};
</script>