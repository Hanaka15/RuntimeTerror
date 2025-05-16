<template>
    <div>
        <h2>{{ question.prompt }}</h2>
        <ul>
            <li v-for="(option, i) in question.options" :key="i" @click="submit(option)" class="option">
                {{ option }}
            </li>
        </ul>
    </div>
</template>

<script setup>
const props = defineProps({ question: Object });
const emit = defineEmits(['answered']);

function submit(choice) {
    emit('answered', choice);
}
</script>
