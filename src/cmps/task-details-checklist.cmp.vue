<template>
  <div>
    <h3>Check Lists</h3>
    <div
      v-for="(checkList, checkListIdx) in checkLists"
      :key="checkListIdx"
    >
      <h4>{{ checkList.title }}</h4>
      <ul>
        <li v-for="(item, idx) in checkList.items" :key="idx">
          {{ item.txt }}
        </li>
      </ul>
      <form @submit.prevent="addItem(checkListIdx)">
        <input type="text" v-model="txt" />
        <button>add to list</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "task-details-checklist",
  props:{
      checkLists: Array
  },
  data() {
    return {
        txt: ''
    };
  },
  methods: {
      addItem(checkListIdx){
          const itemInfo = {
              checkListIdx: checkListIdx ,
              txt: this.txt
          }
          console.log(itemInfo.checkListIdx);
          this.$emit("addItem", itemInfo);
          this.txt = ''
      }
  },
};
</script>