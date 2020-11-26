<template>
  <div class="board-background">
    <ul v-for="idx in 4" :key="idx">
      <li class="img-circle">
        <img
        @click.stop="saveBoardBgc(idx)"
          :src="require(`@/styles/assets/board-background-imgs/bgc${idx}.jpg`)"
          alt="no img background"
        />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    imgUrl: String,
  },
  data() {
    return {};
  },
  methods: {
saveBoardBgc(idx){
  this.$emit('saveBoardBgc', `bgc${idx}.jpg`)
}
  },
};
</script>