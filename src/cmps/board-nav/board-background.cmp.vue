<template>
  <div class="board-background">
    <ul class="flex wrap center">
      <li class="img-circle"  v-for="idx in 8" :key="idx">
        <img
        @click.stop="saveBoardBgc(idx)"
          :src="require(`@/styles/assets/board-background-imgs/bgc${idx}-mini.jpg`)"
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