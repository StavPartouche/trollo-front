<template>
	<div v-if="attachments.length">
        <div class="attachments-header">
            <h3><font-awesome-icon class="task-preview-data-item-icon" :icon="['fas', 'paperclip']" /> Attachments</h3>
            <button v-if="previewImg" @click="removePreviewImg">Remove cover</button>
        </div>
        <canvas class="taskCanvas" width="560" height="360" />
        <ul class="flex wrap align-center justify-space-around data-layout" v-if="attachments">
            <li class="img-container" v-for="(attachment, idx) in attachments" :key="idx">
                <img :src="attachment" class="img-attachments">
                <div class="img-btns">
                    <button @click="removeAttachment(idx)">Remove</button>
                    <button @click="setPreviewImg(idx)">Set cover</button>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>

export default {
    name: 'task-details-attachments',
    props:{
        attachments: Array,
        previewImg: String
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