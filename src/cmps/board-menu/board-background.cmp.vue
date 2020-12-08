<template>
  <div class="board-background flex-column">
    <div class="menu-header">
      <h3>Background</h3>
      <button class="btn-back-to-menu" @click="backToMenu">
        <font-awesome-icon :icon="['fas', 'chevron-left']" />
      </button>
    </div>
    <hr />
    <div v-if="(type === null)" class="flex wrap center">
      <!-- <img class="bgc-img-preview" title="photos" @click="setType('img')" src="@/styles/assets/photos.jpg" alt=""> -->
      <img
        class="bgc-img-preview"
        title="photos"
        @click="setType('img')"
        src="@/styles/assets/photos.jpg"
        alt=""
      />
      <img
        class="bgc-img-preview"
        title="colors"
        @click="setType('color')"
        src="@/styles/assets/colors.png"
        alt=""
      />
    </div>
    <div v-if="(type==='img')" class="photos">
            <div class="flex">
      <button class="btn-back-to-menu" @click="backToBackground">
        <font-awesome-icon :icon="['fas', 'chevron-left']" />
      </button>
      <h4>Photos</h4>
      </div>
      <div v-if="urls">
      <form class="flex" @submit.prevent="getPhotos()" action="">
        <li><input type="text" placeholder="search" v-model="searchPhoto" /></li>
        <button>Send</button>
      </form>
      <ul class="photo-list flex wrap center">
        <li v-for="(url, idx) in urls" :key="idx">
          <img
            class="bgc-img-preview"
            @click.stop="saveBoardBgc(url.regular)"
            :src="`${url.thumb}`"
            alt="no img background"
          />
        </li>
      </ul>
      </div>
    <ul v-else class="flex wrap center">
      <li>For some reason we can't search now, but look at theese options:</li>
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
    </div>
    <div v-if="type === 'color'">
      <div class="flex">
      <button class="btn-back-to-menu" @click="backToBackground">
        <font-awesome-icon :icon="['fas', 'chevron-left']" />
      </button>
      <h4>Colors</h4>
      </div>
      <ul class="flex wrap center">
        <li v-for="idx in 8" :key="idx">
          <div
            @click.stop="saveBoardBgc(idx)"
            class="bgc-img-preview"
            :style="{ backgroundColor: `${colors[idx - 1]}` }"
          ></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getImgUrlByTerm } from "../../services/img-service.js";

export default {
  props: {},
  data() {
    return {
      type: null,
      urls: null,
      searchPhoto: "",
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
        if (this.urls){
          this.$emit("saveBoardBgc", { type: "img", img: `${idx}` });
          } else{
            this.$emit("saveBoardBgc", { type: "img", img: `bgc${idx}.jpg` });
          }
      } else {
        this.$emit("saveBoardBgc", {
          type: "color",
          color: `${this.colors[idx - 1]}`,
        });
      }
    },
    setType(type) {
      this.type = type;
      if (type === "img") {
        this.getPhotos();
      }
    },
    async getPhotos() {
      try{
        var imgDatas = await getImgUrlByTerm(this.searchPhoto);
      if (!imgDatas.length)  var imgDatas = await getImgUrlByTerm('background')
      this.urls = imgDatas.map((imgData) => imgData.urls);
        }catch(err){
          console.log('search error', err);
        } 
    },
    backToMenu() {
      this.$emit("backToMenu");
    },
    backToBackground() {
      this.type = null;
    },
  },
  created() {},
};
</script>