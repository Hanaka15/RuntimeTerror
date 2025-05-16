<template>
    <div class="consent">
        <h2>Consent Form</h2>
        <p v-html="text"></p>
        <label>
            <input type="checkbox" v-model="accepted" />
            I consent to participate in this study.
        </label>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, watchEffect, ref } from 'vue';

const props = defineProps({
    text: String,
    modelValue: Boolean
});
const emit = defineEmits(['update:modelValue']);

const accepted = ref(props.modelValue || false);

watchEffect(() => {
    emit('update:modelValue', accepted.value);
});
</script>
