<template>
  <div class="board-background">
    <div class="menu-header">
      <h3>Background</h3>
      <button class="btn-back-to-menu" @click="backToMenu">
        <font-awesome-icon :icon="['fas', 'chevron-left']" />
      </button>
    </div>
    <hr />
    <img class="bgc-img-preview" title="photos" @click="setType('img')" src="@/styles/assets/photos2.jpg" alt="">
    <img class="bgc-img-preview" title="colors" @click="setType('color')" src="@/styles/assets/colors.png" alt="">
    <ul v-if="type === 'img'" class="flex wrap center">
      <li v-for="idx in 8" :key="idx">
        <img class="bgc-img-preview"
          @click.stop="saveBoardBgc(idx)"
          :src="
            require(`@/styles/assets/board-background-imgs/bgc${idx}-mini.jpg`)
          "
          alt="no img background"
        />
      </li>
    </ul>
    <ul v-if="type === 'color'" class="flex wrap center">
      <li v-for="idx in 8" :key="idx">
        <div
          @click.stop="saveBoardBgc(idx)"
          class="bgc-img-preview"
          :style="{ backgroundColor: `${colors[idx - 1]}` }"
        ></div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      type: null,
      colors: [
        "#39A7E1",
        "#D684B4",
        "#85AEE1",
        "#40C08C",
        "#E99B27",
        "#F34B4B",
        "#9E4B97",
        "#FFE100",
      ],
    };
  },
  methods: {
    saveBoardBgc(idx) {
      if (this.type === "img") {
        this.$emit("saveBoardBgc", { type: "img", img: `bgc${idx}.jpg` });
      } else {
        this.$emit("saveBoardBgc", {
          type: "color",
          color: `${this.colors[idx - 1]}`,
        });
      }
    },
    setType(type) {
      this.type = type;
      console.log(this.type);
    },
    backToMenu() {
      this.$emit("backToMenu");
    },
  },
  created() {},
};
</script>