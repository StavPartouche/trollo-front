<template>
	<div class="task-details-checklist">
        <div class="checklist-header">
            <h4>{{ checkList.title }}</h4>
            <button class="remove-list-btn" @click="removeCheckList"><font-awesome-icon :icon="['fas', 'trash-alt']" /></button>
        </div>
      <el-progress :text-inside="true" :stroke-width="17" :percentage="donePercent" :color="doneColor"></el-progress>
      <ul class="item-container">
        <li class="item" v-for="(item, itemIdx) in checkList.items" :key="itemIdx">
            <label>
                <input class="checkbox" type="checkbox" @change="toggleCheck(checkListIdx, itemIdx)" :checked="item.isDone">
                <span :class="{'line-through': item.isDone}">{{ item.txt }}</span>
            </label>
            <button @click="removeItem(checkListIdx, itemIdx)">X</button>
        </li>
      </ul>
      <button class="add-item-btn green-btn" v-if="!isAddInput" @click="toggleAdd">Add item</button>
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
        },
        removeCheckList(){
            this.$emit('removeCheckList', this.checkListIdx)
        }
    },
    computed:{
        donePercent() {
            const res = this.checkList.items.reduce((doneCount, item) => {
                if (item.isDone) doneCount++;
                return doneCount;
            },0);
            return (res) ? Math.round((res / this.checkList.items.length) * 100) : res;
        },
        doneColor() {
            const percent = this.donePercent;
            if (percent === 100) return '#20D160';
            if (percent >= 50) return '#008DD2';
            if (percent > 25) return '#FFDD57';
            return '#FF385F';
        }
    },
    components: {
        addItemInput
    }
}
</script>