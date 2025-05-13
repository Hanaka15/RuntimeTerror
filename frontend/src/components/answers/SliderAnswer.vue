<template>
<div class="slider-answer">
  <h3>{{ question.question }}</h3>

  <input 
  class="slider"
  type="range"
  :min="question.min || 0"
  :max="question.max || 100"
  :step="question.step || 1"
  :value="modelValue"
  @input="$emit('update:modelValue', +$event.target.value)"
  />
  <p>Current: {{ modelValue }}</p>
</div>
</template>

<script>
export default {
  name: "SliderAnswer",
  props: {
    question: {
      type: Object,
      required: true,
    },
    modelValue: {
      type: Number,
      default: null,
    },
  },
  emits: ["update:modelValue"],
};
</script>

<style lang="scss" scoped>
.slider-answer {
  margin-bottom: 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 60%;
}

h3 {
  margin-bottom: 1rem;
}

.slider {
  width:100%;
  margin: 1rem 0;
}


@media screen and (max-width: 600px) { 
  .slider-answer {
    background-color: var(--background-alt);
    padding: 5rem;
    border-radius: var(--border-radius);
    border: 1px solid var(--border);
    width: 100%;
  }
}
</style>