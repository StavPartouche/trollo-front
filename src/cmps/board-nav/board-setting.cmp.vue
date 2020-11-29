<template>
  <form
    class="board-setting flex-column justify-center"
    v-if="boardToEdit"
    @submit.prevent="saveChanges"
    action=""
  >
    <label for="">
      <input type="text" v-model="boardToEdit.name" />
    </label>
    <label class="flex align-center" for="">
      Due Date:
      <input class="justify-end" type="date" v-model="boardToEdit.dueDate" />
    </label>
    <label class="flex align-center" for="">
      Description:
      <input
        class="justify-end"
        type="text"
        v-model="boardToEdit.description"
      />
    </label>
    <div class="flex center">
      <!-- <p @click="toggleBackground">choose your background:  </p> -->
      <p>choose your background:</p>
    <p @click="toggleBackground('color')" title="colors"><i class="fas fa-palette"></i></p>
    <p @click="toggleBackground('img')" title="photos"><i class="fas fa-image"></i></p>
    </div>
    <board-background
      @saveBoardBgc="saveBoardBgc"
      v-if="isBackground"
      :type="bgcType"
    />
    <div class="flex center">
      <button title="delete board" @click="removeBoard" type="button">
        <i class="fas fa-trash"></i>
      </button>
      <button>save</button>
    </div>
  </form>
</template>

<script>
import boardBackground from "./board-background.cmp";
import { eventBusService } from '../../services/eventBus.service';

export default {
  name: "board-setting",
  props: {
    board: Object,
  },
  data() {
    return {
      boardToEdit: null,
      isBackground: false,
      bgcType: null,
    };
  },
  methods: {
    saveChanges(close=true) {
      this.$emit("saveBoard", {board: this.boardToEdit, close});
    },
    saveBoardBgc(bgc) {
      if (bgc.type === "img") {
        this.boardToEdit.style.url = bgc.img;
      } else {
        this.boardToEdit.style.url = "color";
        this.boardToEdit.style.backgroundColor = bgc.color;
      }
      eventBusService.$emit("boardBgc", this.boardToEdit.style);
      this.saveChanges(false)
    },
    toggleBackground(type) {
      if (this.bgcType === null) {
        this.bgcType = type;
      }
      if (this.bgcType === type) {
        this.isBackground = !this.isBackground;
      } else {
        this.bgcType = type;
      }
    },
    removeBoard() {
      this.$emit("removeBoard");
    },
  },
  computed: {
    imgUrl() {
      // if(!this.boardToEdit.style.url) return
      // else if (this.boardToEdit.style.url==='color'){
        return 'bgc1.jpg'
      // }
      // return this.boardToEdit.style.url;
    },
    bgcColor() {
      // if (this.boardToEdit.style.url==='color'){
      //   return {
      //     backgroundColor: `${this.boardToEdit.style.backgroundColor}`
      //     }
      // }
      return {
          backgroundColor: `#39A7E1`
      }
    },
  },
  created() {
    console.log('setting');
    this.boardToEdit = JSON.parse(JSON.stringify(this.board));
    console.log(this.boardToEdit.style.url);
  },
  components: {
    boardBackground,
  },
};
</script>