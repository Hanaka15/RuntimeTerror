<template>
    <div class="ranking-question">
        <h2>{{ question.question }}</h2>
        <ul class="ranking-list">
            <li
                v-for="(option, index) in localRanking"
                :key="option._id || option.url || option"
                draggable="true"
                @dragstart="dragStart(index)"
                @drop="drop(index)"
                @dragover.prevent
                class="ranking-item"
            >
                <span class="ranking-index">{{ index + 1 }}.</span>
                <span v-if="option.url" class="ranking-img">
                    <img :src="getImageUrl(option.url)" alt="" />
                </span>
                <span v-if="option.description" class="ranking-desc">{{ option.description }}</span>
                <span v-else-if="!option.url">{{ option }}</span>
            </li>
        </ul>
        <button @click="submit" class="ranking-next">Next</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({ question: Object });
const emit = defineEmits(['answered']);

// Use files array as options for ranking
const localRanking = ref([...(props.question.options || props.question.files || [])]);
let draggedIndex = null;

// Helper to prefix backend URL if needed
function getImageUrl(url) {
    if (!url) return '';
    // If already absolute, return as is
    if (/^https?:\/\//.test(url)) return url;
    // Otherwise, prefix with backend address
    return `http://localhost:3000${url}`;
}

function dragStart(index) {
    draggedIndex = index;
}

function drop(index) {
    const moved = localRanking.value.splice(draggedIndex, 1)[0];
    localRanking.value.splice(index, 0, moved);
}

function submit() {
    emit('answered', localRanking.value);
}
</script>

<style scoped>
.ranking-question {
    max-width: 500px;
    margin: 2rem auto;
    padding: 1.5rem 2rem;
    border-radius: 8px;
}

.ranking-list {
    list-style: none;
    padding: 0;
    margin: 2rem 0 0 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.ranking-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    cursor: grab;
    user-select: none;
}

.ranking-item:active {
    cursor: grabbing;
}

.ranking-img img {
    max-width: 100%;
    border-radius: 4px;
    display: block;
}

.ranking-index {
    font-weight: bold;
    min-width: 2rem;
}

.ranking-desc {
    font-weight: 500;
}

.ranking-next {
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
