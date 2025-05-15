<template>
  <div>
    <h4>Ranking Question</h4>
    <FileUploader multiple v-model="local.files" />
    <!-- You can add more config settings here -->
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
