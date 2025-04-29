<template>
    <div>
      <h3>Slider Question</h3>
      <label for="questionText">Question Text</label>
      <input
        id="questionText"
        v-model="questionData.questionText"
        placeholder="Enter Question Text"
      />
  
      <label for="minValue">Min Value</label>
      <input
        id="minValue"
        type="number"
        v-model="questionData.minValue"
        placeholder="Enter Min Value"
      />
  
      <label for="maxValue">Max Value</label>
      <input
        id="maxValue"
        type="number"
        v-model="questionData.maxValue"
        placeholder="Enter Max Value"
      />
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
          minValue: 0,
          maxValue: 100,
        }), // Default to an object with slider values
      },
    },
  };
  </script>
  