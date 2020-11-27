<template>
	<div>
        <h3>Attachments</h3>
        <ul class="flex warp" v-if="attachments">
            <li v-for="(attachment, idx) in attachments" :key="idx">
                <img :src="attachment" class="img-attachments">
                <button>X</button>
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
		
	}
}
</script>