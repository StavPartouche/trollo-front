<template>
	<div class="task-details-checklist">
      <h4>{{ checkList.title }}</h4>
      <ul>
        <li v-for="(item, itemIdx) in checkList.items" :key="itemIdx">
            <label>
                <input class="checkbox" type="checkbox" @change="toggleCheck(checkListIdx, itemIdx)" :checked="item.isDone">
                <span :class="{'line-through': item.isDone}">{{ item.txt }}</span>
            </label>
          <button @click="removeItem(checkListIdx, itemIdx)">X</button>
        </li>
      </ul>
      <button v-if="!isAddInput" @click="toggleAdd">Add item to list</button>
      <!-- <form v-else @submit.prevent="addItem(checkListIdx)">
        <input type="text" v-model="txt" />
        <button>Add</button>
      </form> -->
      <add-item-input v-else @add="addItem(checkListIdx, $event)" />
    </div>
</template>

<script>
import addItemInput from '../add-item-input.cmp';

export default {
    name: 'task-details-checklist',
    props: {
        checkList: Object,
        checkListIdx: Number
    },
	data() {
		return {
            // txt: '',
            isAddInput: false
		}
    },
	methods: {
		addItem(checkListIdx, itemTxt){
            if(itemTxt === ''){
                this.toggleAdd()
                return 
            }
            this.$emit('addItem', {
                checkListIdx,
                txt: itemTxt
            })
            // this.txt = ''
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
            this.$emit('toggleCheck', {
                checkListIdx,
                itemIdx
            })
        }
    },
    computed:{
        
    },
    components: {
        addItemInput
    }
}
</script>