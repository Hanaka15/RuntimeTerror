<template>
    <div>
      <h3>Questions</h3>
      <div v-for="(question, index) in questions" :key="index" class="question-item" @click="selectQuestion(index)">
        {{ question.name }}
      </div>
      <button @click="addQuestion">Add Question</button>
    </div>
  </template>
  
  <script>
  export default {
    props: ['questions'],
    methods: {
      addQuestion() {
        this.$emit('add-question');
      },
      selectQuestion(index) {
        this.$emit('select-question', index);
      }
    }
  };
  </script>
  
  <style scoped>
  .question-item {
    padding: 8px;
    margin: 5px;
    border: 1px solid #ccc;
    cursor: pointer;
  }
  
  .question-item:hover {
    background-color: #f0f0f0;
  }
  </style>
  