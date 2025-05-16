<template>
  <div>
    <h4>Ranking Question</h4>
    <label>Question Text</label>
    <input class="input" v-model="local.question" type="text" placeholder="Enter question text..." />
    <FileUploader multiple v-model="local.files" />
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
.input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

</style>
