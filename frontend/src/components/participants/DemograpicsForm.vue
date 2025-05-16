<template>
    <form @submit.prevent="emitDemographics" class="demographics-form">
        <div v-for="field in schema" :key="field.name" class="demographics-field">
            <label :for="field.name">{{ field.label }}</label>
            <input
                v-model="model[field.name]"
                :type="field.type || 'text'"
                :id="field.name"
                :name="field.name"
                :required="field.required"
            />
        </div>
        <button type="submit" class="demographics-submit">Continue</button>
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

<style scoped>
.demographics-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.demographics-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.demographics-field label {
    font-weight: 500;
}

.demographics-field input {
    border-radius: 4px;
    border: 1px solid #ccc;
}

.demographics-submit {
    width: 100%;
}
</style>
