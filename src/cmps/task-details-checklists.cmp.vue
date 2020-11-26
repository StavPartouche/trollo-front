<template>
  <div>
    <h3>Check Lists</h3>
    <ul>
      <li v-for="(checkList, checkListIdx) in checkLists" :key="checkListIdx">
        <checkList :checkList="checkList" :checkListIdx="checkListIdx" @addItem="addItem"/>
      </li>
    </ul>
  </div>
</template>

<script>

import checkList from './task-details-checklist.cmp'

export default {
  name: "task-details-checklists",
  props:{
      checkLists: Array
  },
  data() {
    return {
        
    };
  },
  methods: {
      addItem(updates){
          const itemInfo = {
              checkListIdx: updates.checkListIdx ,
              txt: updates.txt
          }
          console.log(itemInfo.checkListIdx);
          this.$emit("addItem", itemInfo);
      }
  },
  components:{
    checkList
  }
};
</script>