<template>
    <form @submit.prevent="emitDemographics">
        <div v-for="field in schema" :key="field.name">
            <label :for="field.name">{{ field.label }}</label>
            <input v-model="model[field.name]" :type="field.type || 'text'" :id="field.name" :name="field.name"
                :required="field.required" />
        </div>
        <button type="submit">Continue</button>
    </form>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    schema: Array,
    modelValue: Object
});
const emit = defineEmits(['update:modelValue', 'submitted']);

const model = ref({ ...props.modelValue });

watchEffect(() => {
    emit('update:modelValue', model.value);
});

const emitDemographics = () => {
    emit('submitted');
};
</script>
