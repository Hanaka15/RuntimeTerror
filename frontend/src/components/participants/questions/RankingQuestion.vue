<template>
    <div>
        <h2>{{ question.prompt }}</h2>
        <ul>
            <li v-for="(option, index) in localRanking" :key="option" draggable="true" @dragstart="dragStart(index)"
                @drop="drop(index)" @dragover.prevent>
                {{ index + 1 }}. {{ option }}
            </li>
        </ul>
        <button @click="submit">Next</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({ question: Object });
const emit = defineEmits(['answered']);

const localRanking = ref([...props.question.options]);
let draggedIndex = null;

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
