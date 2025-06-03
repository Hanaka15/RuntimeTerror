<template>
    <form @submit.prevent="emitDemographics" class="demographics-form">
        <div v-for="(field, idx) in schema" :key="idx" class="demographics-field">
            <label :for="'demographic-' + idx">{{ field.label }}</label>
            <input
                :id="'demographic-' + idx"
                :name="field.label"
                :type="field.type || 'text'"
                :required="field.required"
                :value="model[field.label] ?? ''"
                @input="updateField(field.label, $event.target.value, field.type)"
                autocomplete="off"
            />
        </div>
        <button type="submit" class="demographics-submit">Continue</button>
    </form>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
    schema: Array,
    modelValue: Object,
});
const emit = defineEmits(['update:modelValue', 'submitted']);

const model = reactive({});

watch(
    () => [props.schema, props.modelValue],
    ([schema, modelValue]) => {
        if (!schema) return;
        for (const field of schema) {
            model[field.label] = (modelValue && modelValue[field.label]) || '';
        }
    },
    { immediate: true }
);

function updateField(label, value, type) {
    model[label] = type === 'number' && value !== '' ? Number(value) : value;
    emit('update:modelValue', { ...model });
}

function emitDemographics() {
    emit('submitted');
}
</script>
