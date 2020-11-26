<template>
	<div>
      <h4>{{ checkList.title }}</h4>
      <ul>
        <li v-for="(item, idx) in checkList.items" :key="idx">
          {{ item.txt }}
        </li>
      </ul>
      <button v-if="!isAddInput" @click="toggleAdd">add to list</button>
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
        }
	}
}
</script>