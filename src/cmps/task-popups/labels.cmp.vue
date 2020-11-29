<template>
  <div class="task-popup">
    <h3 class="task-popup-header">Labels</h3>
    <button @click="closePopup" class="exit-popup-btn">X</button>
    <ul class="labels-container" v-if="labels">
        <li @click="toggleLabel(label)" class="chose-label" :style='{backgroundColor: label.backgroundColor}' v-for="(label,idx) in labels" :key="idx">
            <h3>{{label.txt}}</h3>
        </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "lables",
  props:{
      labels:Array
  },
  data() {
    return {
      
    };
  },
  methods: {
    closePopup() {
      this.$emit("closePopup");
    },
    toggleLabel(label){
        this.$emit('toggleLabel', label)
    }
  },
  created(){
  }
};
</script>