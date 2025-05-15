<template>
  <div class="multiple-choice-answer">
    <h3>{{ question.question }}</h3>
    <img v-if="question.image" :src="question.image" alt="Question Image" class="question-image" />
    <div
      v-for="(choice, index) in question.choices"
      :key="choice"
      class="choice-card"
      :class="{ selected: modelValue === choice }"
      @click="$emit('update:modelValue', modelValue === choice ? null : choice)"
    >
      {{ choice }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'MultipleChoiceAnswer',
  props: {
    question: {
      type: Object,
      required: true,
    },
    modelValue: {
      type: String,
      default: null,
    },
  },
  emits: ['update:modelValue'],
};
</script>

<style scoped>
.multiple-choice-answer {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: left;
  width: 60%;
}
.choice-card {
  padding: 1rem;
  background-color: var(--background-alt);
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
  margin: var(--gap) 0;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;
  width: 100%;
}
.choice-card:hover {
  background-color: var(--focus);
}
.choice-card.selected {
  background-color: var(--selection);
}

@media screen and (max-width: 600px) { 
  .multiple-choice-answer {
    text-align: center;
  }
}
</style>
