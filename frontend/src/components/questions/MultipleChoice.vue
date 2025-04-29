<template>
    <div>
      <h3>Multiple Choice Question</h3>
      <label for="questionText">Question Text</label>
      <input
        id="questionText"
        v-model="questionData.questionText"
        placeholder="Enter Question Text"
      />
  
      <h4>Choices</h4>
      <div v-for="(choice, index) in questionData.choices" :key="index">
        <input v-model="questionData.choices[index]" placeholder="Enter Choice" />
      </div>
      <button @click="addChoice">Add Choice</button>
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
          choices: [],
        }), // Default to empty object if no data is passed
      },
    },
    methods: {
      addChoice() {
        this.questionData.choices.push("");
      },
    },
  };
  </script>
  