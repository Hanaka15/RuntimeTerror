<template>
    <div>
      <h3>Rank Question</h3>
      <label for="questionText">Question Text</label>
      <input
        id="questionText"
        v-model="questionData.question"
        placeholder="Enter Question Text"
        @input="emitQuestionChange"
      />
  
      <h4>Options</h4>
      <div v-for="(option, index) in questionData.items" :key="index">
        <input v-model="questionData.items[index]" placeholder="Enter Option" @input="emitQuestionChange"/>
      </div>
      <button @click="addOption">Add Option</button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      questionData: {
        type: Object,
        required: true,
        default: () => ({
          question: "",
          items: [],
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
  