<template>
    <div>
      <h3>Rank Question</h3>
      <label for="questionText">Question Text</label>
      <input
        id="questionText"
        v-model="questionData.questionText"
        placeholder="Enter Question Text"
      />
  
      <h4>Options</h4>
      <div v-for="(option, index) in questionData.options" :key="index">
        <input v-model="questionData.options[index]" placeholder="Enter Option" />
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
          questionText: "",
          options: [],
        }), 
      },
    },
    methods: {
      addOption() {
        this.questionData.options.push("");
      },
    },
  };
  </script>
  