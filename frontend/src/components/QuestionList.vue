<template>
    <div>
      <h3>Questions</h3>
      <div v-for="(question, index) in questions" :key="index" class="question-item" :class="{ selected: modelValue === choice }" @click="selectQuestion(index)">
        {{ question.question || `Question ${index + 1}` }}
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
  
  <style lang="scss" scoped>
  .question-item {
    padding: 8px;
    margin: 5px;
    border: 1px solid #ccc;
    cursor: pointer;

    &:hover {
      background-color: var(--focus);
    }
  }
  </style>
  
