<template>
  <div>
    <h3>Labels</h3>
    <ul class="flex">
      <li v-for="(label, idx) in labels" :key="idx">
        <div class="label-preview" :style='{backgroundColor: label.backgroundColor}'></div>
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