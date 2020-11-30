<template>
  <div class="task-popup">
    <h3 class="task-popup-header">BackgroundColor</h3>
    <button @click="closePopup" class="exit-popup-btn">X</button>
    <ul class="colors-container">
            <li class="color" style="background-color: lightgoldenrodyellow" @click="setTaskColor($event)"></li>
            <li class="color" style="background-color: white" @click="setTaskColor($event)"></li>
            <li class="color" style="background-color: rgb(255 204 212)" @click="setTaskColor($event)"></li>
            <li class="color" style="background-color: rgb(251 204 255)" @click="setTaskColor($event)"></li>
            <li class="color" style="background-color: rgb(223 204 255)" @click="setTaskColor($event)"></li>
            <li class="color" style="background-color: rgb(187 190 253)" @click="setTaskColor($event)"></li>
            <li class="color" style="background-color: rgb(187 221 253)" @click="setTaskColor($event)"></li>
            <li class="color" style="background-color: rgb(187 253 246)" @click="setTaskColor($event)"></li>
            <li class="color" style="background-color: rgb(153 255 187)" @click="setTaskColor($event)"></li>
            <li class="color" style="background-color: rgb(171 255 153)" @click="setTaskColor($event)"></li>
            <li class="color" style="background-color: rgb(232 255 153)" @click="setTaskColor($event)"></li>
            <li class="color" style="background-color: rgb(255 217 153)" @click="setTaskColor($event)"></li>
            <li class="color" style="background-color: rgb(255 170 153)" @click="setTaskColor($event)"></li>
            <li class="color" style="background-color: rgb(191 191 191)" @click="setTaskColor($event)"></li>
        </ul>
  </div>
</template>

<script>
export default {
  name: "backgroundColor",
  data() {
    return {
      
    };
  },
  methods: {  
    closePopup() {
      this.$emit("closePopup");
    },
    setTaskColor(ev){
        this.$emit('setTaskColor', event.target.style.backgroundColor)
        closePopup()
    }
  },
};
</script>