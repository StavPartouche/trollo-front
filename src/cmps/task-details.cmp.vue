<template>
  <div class="task-details">
    {{task.name}}
  </div>
</template>

<script>


export default {
  name: 'task-details',
  props:{
      task:{
          type:Object
      }
  },
  data(){
    return{
      
    }
  },
  methods:{ 
    
  },
  computed:{
    
  },
  created(){
    
  }
}
</script>