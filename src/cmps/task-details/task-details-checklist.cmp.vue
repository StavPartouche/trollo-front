<template>
	<div class="task-details-checklist">
      <h4>{{ checkList.title }}</h4>
      <ul>
        <li v-for="(item, itemIdx) in checkList.items" :key="itemIdx">
            <label>
            <span :class="{'line-through': item.isDone}">{{ item.txt }}</span>
                <input class="checkbox" type="checkbox" @change="toggleCheck(checkListIdx, itemIdx)">
            </label>
          <button @click="removeItem(checkListIdx, itemIdx)">X</button>
          {{item}}
        </li>
      </ul>
      <button v-if="!isAddInput" @click="toggleAdd">Add item to list</button>
      <form v-else @submit.prevent="addItem(checkListIdx)">
        <input type="text" v-model="txt" />
        <button>Add</button>
      </form>
    </div>
</template>

<script>

export default {
    name: 'task-details-checklist',
    props: {
        checkList: Object,
        checkListIdx: Number
    },
	data() {
		return {
            txt: '',
            isAddInput: false
		}
    },
	methods: {
		addItem(checkListIdx){
            if(this.txt === ''){
                this.toggleAdd()
                return 
            }
            this.$emit('addItem', {
                checkListIdx,
                txt: this.txt
            })
            this.txt = ''
            this.toggleAdd()
        },
        toggleAdd(){
            this.isAddInput = !this.isAddInput
        },
        removeItem(checkListIdx, itemIdx){
            this.$emit('removeItem', {
                checkListIdx,
                itemIdx
            })
        },
        toggleCheck(checkListIdx, itemIdx){
            // this.checkList.items[itemIdx].isDone = !this.checkList.items[itemIdx].isDone
            console.log(checkListIdx, itemIdx);
            this.$emit('toggleCheck', {
                checkListIdx,
                itemIdx
            })
        }
    },
    computed:{
        
    }
}
</script>