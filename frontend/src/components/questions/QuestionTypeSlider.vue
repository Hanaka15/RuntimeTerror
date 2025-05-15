<template>
  <div>
    <h4>Slider Question</h4>
    <FileUploader :multiple="false" v-model="local.files" />
    <label>Min Value</label>
    <input type="number" v-model="local.config.min" />
    <label>Max Value</label>
    <input type="number" v-model="local.config.max" />
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
