<template>
    <div>

      <h4>Attach Files</h4>
      <FileUpload :questionData="questionData" @update="emitQuestionChange"></FileUpload>
      <h3>Slider Question</h3>
  
      <label for="questionText">Question Text</label>
      <input
        id="questionText"
        v-model="questionData.question"
        placeholder="Enter Question Text"
        @input="emitQuestionChange"
      />
  
      <label for="minValue">Min Value</label>
      <input
        id="minValue"
        type="number"
        v-model="questionData.min"
        placeholder="Enter Min Value"
        @input="emitQuestionChange"
      />
  
      <label for="maxValue">Max Value</label>
      <input
        id="maxValue"
        type="number"
        v-model="questionData.max"
        placeholder="Enter Max Value"
        @input="emitQuestionChange"
      />
    </div>
  </template>
  
  <script>
  import FileUpload from './fileUpload.vue';
  export default {
    components: {
      FileUpload,
    },
    props: {
      questionData: {
        type: Object,
        required: true,
        default: () => ({
          question: "",
          min: 0,
          max: 100,
          files: [],
        }), // Default to an object with slider values
      },
    },
    methods: {
      emitQuestionChange() {
        this.$emit("update", this.questionData);
      },
    }
  };
  </script>