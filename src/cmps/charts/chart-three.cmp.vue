<script>
import { Line } from 'vue-chartjs'
 
export default {
  props:{
    board: Object
  },
    name: 'chart-three',
  extends: Line,
  mounted () {
    this.renderChart({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Tasks by months',
          backgroundColor: '#6fbcb0',
          data: this.dueDates
        }
      ]
    })
  },
  computed:{
    dueDates(){
      const dueMonths = [0,0,0,0,0,0,0,0,0,0,0,0]
      this.board.lists.forEach(list => {
        list.tasks.forEach(task => {
          if(task.dueDate){
              const idx = new Date(task.dueDate).getMonth();
              dueMonths[idx]++
            } 
        })
      });
      return dueMonths
    }
  },
}
</script>