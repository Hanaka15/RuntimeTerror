<template>
    <div class="preference-question">
        <h2>{{ question.question }}</h2>
        <ul class="options-list">
            <li
                v-for="(option, i) in options"
                :key="option._id || option.url || i"
                @click="submit(option)"
                class="option"
            >
                <span v-if="option.url" class="option-img">
                    <img :src="getImageUrl(option.url)" alt="" />
                </span>
                <span v-if="option.description" class="option-desc">{{ option.description }}</span>
                <span v-else-if="!option.url">{{ option }}</span>
            </li>
        </ul>
    </div>
</template>

<script setup>
const props = defineProps({ question: Object });
const emit = defineEmits(['answered']);

// Use files array as options for preference questions
const options = props.question.options || props.question.files || [];

// Helper to prefix backend URL if needed
function getImageUrl(url) {
    if (!url) return '';
    // If already absolute, return as is
    if (/^https?:\/\//.test(url)) return url;
    // Otherwise, prefix with backend API address
    return `https://group2.sustainability.it.ntnu.no/api${url}`;
}

function submit(choice) {
    emit('answered', choice);
}
</script>

<style scoped>
.preference-question {
    max-width: 500px;
    margin: 2rem auto;
    padding: 1.5rem 2rem;
    border-radius: 8px;
}

.options-list {
    list-style: none;
    padding: 0;
    margin: 2rem 0 0 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.option {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.15s, border 0.15s;
    user-select: none;
}

.option:hover {
    background: #f5f5f5;
    border-color: #bbb;
}

.option-img img {
    max-width: 80px;
    max-height: 60px;
    border-radius: 4px;
    display: block;
}

.option-desc {
    font-weight: 500;
}
</style>
