<template>
  <div  v-if="labels.length">
    <ul class="flex data-layout">
      <li v-for="(label, idx) in labels" :key="idx">
        <el-tooltip popper-class="title" :visible-arrow="false" effect="light" :content="label.txt" placement="top">
         <div class="task-preview-label" :style='{backgroundColor: label.backgroundColor}'></div>  
        </el-tooltip>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "task-details-labels",
  props:{
      labels: Array
  },
  data() {
    return {};
  },
  methods: {},
  created(){
    
  }
};
</script>
