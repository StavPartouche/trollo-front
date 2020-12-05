<template>
	<div class="task-popup">
		<h3 class="task-popup-header">Labels</h3>
		<button @click="closePopup" class="exit-popup-btn">
			<font-awesome-icon :icon="['fas', 'times']" />
		</button>
		<ul class="labels-container" v-if="labels">
			<li
				@click="toggleLabel(label, idx)"
				class="chose-label"
				:style="{ backgroundColor: label.backgroundColor }"
				v-for="(label, idx) in labels"
				:key="idx"
			>
					<!-- @blur="emitLabelTxt(idx)" -->
				<h3
					@keydown.enter="emitLabelTxt(idx)"
					@blur="emitLabelTxt(idx)"
					:ref="`label${idx}`"
				>
					{{ label.txt }}
				</h3>
				<!-- <button class="label-txt-btn"  v-if="!isEdits[idx]" @click.stop="toggleEditLabel(idx)"> -->
				<button class="label-txt-btn"  v-if="!isEdits[`${idx}`]" @click.stop="toggleEditLabel(idx)">
					<!-- <font-awesome-icon v-if="!isEditable(idx)" -->
					<font-awesome-icon
						:icon="['fas', 'pencil-alt']"
					/>
				</button>
				<!-- <button class="label-txt-btn" v-if="isEdits[idx]" @click.stop="toggleEditLabel(idx)"> -->
				<button class="label-txt-btn" v-if="isEdits[`${idx}`]" @click.stop="toggleEditLabel(idx)">
					<font-awesome-icon
						:icon="['fas', 'check']"
					/>
				</button>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
  name: "lables",
  props: {
    labels: Array,
  },
  data() {
    return {
      isEdits: {
		  '0': null,
		  '1': null,
		  '2': null,
		  '3': null,
		  '4': null,
		  '5': null,
	  },
    };
  },
  methods: {
    closePopup() {
      this.$emit("closePopup");
    },
    isEditable(idx) {
      if (!this.$refs[`label${idx}`]) return;
      // console.log(this.$refs[`label${idx}`][0].isContentEditable)
      return this.$refs[`label${idx}`][0].isContentEditable;
    },
    toggleLabel(label, idx) {
      if (this.isEditable(idx)) return;
      this.$emit("toggleLabel", label);
    },
    toggleEditLabel(idx) {
		console.log(idx);
    //   this.isEdits[idx] = !this.isEdits[idx];
      this.isEdits[`${idx}`] = !this.isEdits[`${idx}`];
      const elH3 = this.$refs[`label${idx}`][0];
      elH3.contentEditable = this.isEdits[`${idx}`];
      console.log(this.isEdits)
      if (this.isEdits[`${idx}`]) elH3.focus();
    },
    emitLabelTxt(idx) {
      const txt = this.$refs[`label${idx}`][0].innerText;
      this.$emit("labelTxt", { idx, txt });
    },
  },
  created() {},
};
</script>