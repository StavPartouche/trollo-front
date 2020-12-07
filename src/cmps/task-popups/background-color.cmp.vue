<template>
  <div class="task-popup">
    <h3 class="task-popup-header">Background</h3>
    <button @click="closePopup" class="exit-popup-btn"><font-awesome-icon :icon="['fas', 'times']" /></button>
    <ul class="colors-container">
            <li class="color" style="background-color: lightgoldenrodyellow" @click="setTaskColor($event)"></li>
            <li class="color" style="background-color: #fafafa" @click="setTaskColor($event)"></li>
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
            <li class="color" style="background-color: #62bb84" @click="setTaskColor($event)"></li>
            <li class="color" style="background-color: #86bb62" @click="setTaskColor($event)"></li>
            <li class="color" style="background-color: #b3bb62" @click="setTaskColor($event)"></li>
            <li class="color" style="background-color: #bb9a62" @click="setTaskColor($event)"></li>
            <li class="color" style="background-color: #bb7962" @click="setTaskColor($event)"></li>
            <li class="color" style="background-color: #927674" @click="setTaskColor($event)"></li>
            <li class="color" style="background-color: #748e92" @click="setTaskColor($event)"></li>
            <li class="color" style="background-color: #712020" @click="setTaskColor($event)"></li>
            <li class="color" style="background-color: #712038" @click="setTaskColor($event)"></li>
            <li class="color" style="background-color: #712052" @click="setTaskColor($event)"></li>
            <li class="color" style="background-color: #502071" @click="setTaskColor($event)"></li>
            <li class="color" style="background-color: #202f71" @click="setTaskColor($event)"></li>
            <li class="color" style="background-color: #205171" @click="setTaskColor($event)"></li>
            <li class="color" style="background-color: #207164" @click="setTaskColor($event)"></li>
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
        this.closePopup()
    }
  },
};
</script>