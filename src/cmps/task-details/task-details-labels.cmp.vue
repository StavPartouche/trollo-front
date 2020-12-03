<template>
  <div  v-if="labels.length">
    <ul class="flex data-layout">
      <li v-for="(label, idx) in labels" :key="idx">
        <div class="task-preview-label" :style='{backgroundColor: label.backgroundColor}'></div>
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