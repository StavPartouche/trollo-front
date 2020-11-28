<template>
	<div>
        <h3>Attachments</h3>
        <button @click="removePreviewImg">remove preview img</button>
        <ul class="flex warp" v-if="attachments">
            <li v-for="(attachment, idx) in attachments" :key="idx">
                <img :src="attachment" class="img-attachments">
                <button @click="removeAttachment(idx)">X</button>
                <button @click="setPreviewImg(idx)">set a cover</button>
            </li>
        </ul>
    </div>
</template>

<script>

export default {
    name: 'task-details-attachments',
    props:{
        attachments: Array
    },
	data() {
		return {
			
		}
	},
	methods: {
		removeAttachment(idx){
            this.$emit('removeAttachment', idx)
        },
        setPreviewImg(idx){
            this.$emit('setPreviewImg', idx)
        },
        removePreviewImg(){
            this.$emit('removePreviewImg')
        }
	}
}
</script>