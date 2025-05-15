<template>
  <div>
    <h3>Multiple Choice Question</h3>
    <label for="questionText">Question Text</label>
    <input
      id="questionText"
      v-model="questionData.question"
      placeholder="Enter Question Text"
      @input="emitQuestionChange"
    />
    <h4>Attach Files</h4>
    <Fileupload
      :questionData="questionData"
      @update="emitQuestionChange"
    ></Fileupload>

    <div class="choices-wrapper">
      <div class="header-wrapper">
        <h4>Choices</h4>
      </div>

      <div
        v-for="(choice, index) in questionData.choices"
        :key="index"
        class="alternative-wrapper"
      >
        <input v-model="choice.text" placeholder="Enter Choice" />
        <label
          ><input
            type="radio"
            name="correctAnswer"
            :checked="choice.isCorrect"
            @change="setCorrect(index)"
          />
          <span style="opacity: 0.6; font-size: small">correct?</span>
        </label>
      </div>

      <button @click="addChoice">Add Choice</button>
    </div>
  </div>
</template>

<script>
import Fileupload from "./fileUpload.vue";
export default {
  components: {
    Fileupload,
  },
  props: {
    questionData: {
      type: Object,
      required: true,
      default: () => ({
        question: "",
        choices: [],
        files: [],
      }), // Default to empty object if no data is passed
    },
  },
  methods: {
    addChoice() {
      this.questionData.choices.push({ text: "", isCorrect: false });
    },

    setCorrect(index) {
      this.questionData.choices.forEach((choice, i) => {
        choice.isCorrect = i === index;
      });
      this.emitQuestionChange();
    },

    emitQuestionChange() {
      this.$emit("update", this.questionData);
    },
  },
};
</script>

<style lang="scss" scoped>
.alternative-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}
</style>
