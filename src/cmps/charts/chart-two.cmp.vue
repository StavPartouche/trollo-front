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
    // Overwriting base render method with actual data.
    this.renderChart({
      labels: this.memberNames,
      datasets: [
        {
          label: "Tasks per member",
          backgroundColor: "#f87979",
          data: [1,1,1,1],
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
  },
  created() {
    console.log(this.board);
  },
};
</script>