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
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: [
        {
          label: 'Tasks by months',
          backgroundColor: '#f87979',
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