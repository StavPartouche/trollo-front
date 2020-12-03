<template>
  <div>
    <h3 v-if="checkLists.length"><font-awesome-icon :icon="['fas', 'tasks']" /> CheckLists</h3>
    <ul class="data-layout">
      <li v-for="(checkList, checkListIdx) in checkLists" :key="checkListIdx">
        <checkList :checkList="checkList" :checkListIdx="checkListIdx" 
          @addItem="addItem" @removeItem="removeItem" @toggleCheck="toggleCheck" @removeCheckList="removeCheckList"/>
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
          this.$emit("addItem", itemInfo);
      },
      removeItem(idxs){
        this.$emit("removeItem", idxs)
      },
      toggleCheck(idxs){
        this.$emit("toggleCheck", idxs)
      },
      removeCheckList(idx){
        this.$emit('removeCheckList', idx)
      }
  },
  components:{
    checkList
  }
};
</script>