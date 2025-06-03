<template>
  <div class="slider-question">
    <div class="config-row">
      <div class="question-config">
        <h4>Slider Question</h4>
        <label>Question Text</label>
        <input v-model="local.question" type="text" placeholder="Enter question text..." />
      </div>
      <div class="slider-config">
        <label>Min Value</label>
        <input type="number" v-model="local.config.min" />
        <label>Max Value</label>
        <input type="number" v-model="local.config.max" />
      </div>
    </div>
    <FileUploader :multiple="false" v-model="local.files" />
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';
import FileUploader from '../FileUploader.vue';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const local = reactive({ ...props.modelValue });

watch(local, () => {
  emit('update:modelValue', local);
}, { deep: true });
</script>
<style lang="scss" scoped>
.slider-question {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.config-row {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  flex-wrap: wrap;
}

.question-config,
.slider-config {
  flex: 1 1 250px;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

input[type="text"],
input[type="number"] {
  width: 100%;
  box-sizing: border-box;
}
</style>