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
      <Fileupload :questionData="questionData" @update="emitQuestionChange"></Fileupload>
  
      <h4>Choices</h4>
      <div v-for="(choice, index) in questionData.choices" :key="index">
        <input v-model="questionData.choices[index]" placeholder="Enter Choice" />
      </div>
      <button @click="addChoice">Add Choice</button>
    </div>
  </template>
  
  <script>
  import Fileupload from './fileUpload.vue';
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
          files:[],
        }), // Default to empty object if no data is passed
      },
    },
    methods: {
      addChoice() {
        this.questionData.choices.push("");
      },
      emitQuestionChange() {
        this.$emit("update", this.questionData);
      }
    },
  };
  </script>