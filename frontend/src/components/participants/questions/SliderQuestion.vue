<template>
    <div class="slider-question">
        <h2>{{ question.question }}</h2>
        <div v-if="question.files && question.files.length > 0" class="slider-image">
            <img
                :src="getImageUrl(question.files[0].url)"
                alt=""
            />
            <div v-if="question.files[0].description" class="slider-img-desc">{{ question.files[0].description }}</div>
        </div>
        <div class="slider-input">
            <span class="slider-value">{{ value }}</span>
            <input
                type="range"
                :min="question.min"
                :max="question.max"
                :step="question.step"
                v-model.number="value"
            />
        </div>
        <button @click="submit" class="slider-next">Next</button>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
const props = defineProps({ question: Object });
const emit = defineEmits(['answered']);

const value = ref(props.question.min ?? 0);

watch(
    () => props.question.min,
    (min) => {
        value.value = min ?? 0;
    }
);

// Helper to prefix backend URL if needed
function getImageUrl(url) {
    if (!url) return '';
    // If already absolute, return as is
    if (/^https?:\/\//.test(url)) return url;
    // Otherwise, prefix with backend API address
    return `https://group2.sustainability.it.ntnu.no/api${url}`;
}

function submit() {
    emit('answered', value.value);
}
</script>

<style scoped>
.slider-question {
    max-width: 500px;
    margin: 2rem auto;
    padding: 1.5rem 2rem;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    text-align: center;
    gap: 2rem;
}

.slider-image {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.slider-image img {
    max-width: 100%;
    border-radius: 6px;
    display: block;
}

.slider-img-desc {
    font-size: 0.95rem;
    text-align: center;
}

.slider-input {
    text-align: center;
    width: 100%;
    gap: 1.5rem;
    margin: 1rem 0;
    input {
        width: 100%;
        box-shadow: none;
    }
}

.slider-value {
    font-size: 1.5rem;
    font-weight: 500;
    min-width: 2.5rem;
    text-align: center;
}

.slider-next {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    font-size: 1.25rem;
    padding: 1rem 2rem;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}
</style>
