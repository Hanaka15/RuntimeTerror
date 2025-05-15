<template>
  <div>
    <h3>Questions</h3>
    <div 
      v-for="(question, index) in questions" 
      :key="index" 
      class="question-item" 
      :class="{ selected: modelValue === index }" 
      @click="selectQuestion(index)"
    >
      {{ question.question || `Question ${index + 1}` }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    questions: {
      type: Array,
      default: () => []
    },
    modelValue: {
      type: Number,
      default: null
    }
  },
  methods: {
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