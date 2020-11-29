<template>
  <div class="board-background">
    <ul v-if="type === 'img'" class="flex wrap center">
      <li class="img-circle" v-for="idx in 8" :key="idx">
        <img
          @click.stop="saveBoardBgc(idx)"
          :src="
            require(`@/styles/assets/board-background-imgs/bgc${idx}-mini.jpg`)
          "
          alt="no img background"
        />
      </li>
    </ul>
    <ul v-if="type === 'color'" class="flex wrap center">
      <li  v-for="idx in 8" :key="idx">
        <div @click.stop="saveBoardBgc(idx)" class="circle-30" :style="{backgroundColor: `${colors[idx-1]}`}"></div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    type: String,
  },
  data() {
    return {
      colors: ['#39A7E1', '#D684B4', '#85AEE1', '#40C08C', '#E99B27', '#F34B4B', '#9E4B97', '#FFE100']
    };
  },
  methods: {
    saveBoardBgc(idx) {
      console.log(this.type);
      if (this.type==='img'){
        this.$emit("saveBoardBgc", {type: 'img', img:`bgc${idx}.jpg`})
      }else{
        this.$emit("saveBoardBgc", {type: 'color', color:`${this.colors[idx-1]}`})
      }
    },
  },
};
</script>