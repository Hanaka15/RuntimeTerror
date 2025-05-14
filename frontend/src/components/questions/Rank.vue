<template>
    <div>
      <h3>Rank Question</h3>
      <h4>Attach Files</h4>
      <FileUpload :questionData="questionData" @update="emitQuestionChange"></FileUpload>
      <label for="questionText">Question Text</label>
      <input
        id="questionText"
        v-model="questionData.question"
        placeholder="Enter Question Text"
        @input="emitQuestionChange"
      />
  
      <h4>Options</h4>
      <div v-for="(item, index) in questionData.items" :key="index">
        <input v-model="questionData.items[index]" placeholder="Enter Option" @input="emitQuestionChange"/>
      </div>
      <button @click="addOption">Add Option</button>
    </div>
  </template>
  
  <script>
  import FileUpload from './fileUpload.vue';
  export default {
    components:{
      FileUpload
    },
    props: {
      questionData: {
        type: Object,
        required: true,
        default: () => ({
          question: "",
          items: [],
          files: [],
        }), 
      },
    },
    methods: {
      addOption() {
        if (!this.questionData.items) {
          this.questionData.items = [];
        }
        this.questionData.items.push("");
        this.emitQuestionChange();
      },
      emitQuestionChange() {
        this.$emit('update', this.questionData);
      }
    },
  };
  </script>
  