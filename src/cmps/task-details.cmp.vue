<template>
  <div class="task-details">
      <button @click="closeDetails">X</button>
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
    closeDetails(){
        this.$emit('close')
    }
  },
  computed:{
    
  },
  created(){
    
  }
}
</script>