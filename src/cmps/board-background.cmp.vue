<template>
  <div class="board-background">
    img
    <!-- <img src="@/styles/assets/board-background-imgs/bgc1.jpg" alt="" /> -->
    <ul v-for="idx in 4" :key="idx">
      <li class="img-circle">
        <!-- <img
          :src="`@/styles/assets/board-background-imgs/bgc${idx}.jpg`"
          alt="no img"
        /> -->
        <img
          src="@/styles/assets/board-background-imgs/bgc1.jpg"
          alt="no img"
        />
        <!-- <img :src="getUrl(idx)" alt="img" /> -->
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
    getUrl(idx) {
      console.log(idx);
      return `@/styles/assets/board-background-imgs/bgc${idx}.jpg`;
    },
  },
};
</script>