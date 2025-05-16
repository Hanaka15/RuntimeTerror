<template>
    <div v-if="currentQuestion">
        <component :is="componentType" :question="currentQuestion" @answered="handleAnswer" />
    </div>
    <div v-else>
        <p>Loading question...</p>
    </div>
</template>

<script setup>
import { computed, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useParticipantStore } from '@/store/participantStore';

import RankingQuestion from './questions/RankingQuestion.vue';
import PreferenceQuestion from './questions/PreferenceQuestion.vue';

const router = useRouter();
const store = useParticipantStore();

const currentQuestion = computed(() => {
    return store.study?.questions?.[store.currentQuestionIndex] || null;
});

const componentType = computed(() => {
    if (!currentQuestion.value) return null;

    switch (currentQuestion.value.type) {
        case 'ranking': return RankingQuestion;
        case 'preference': return PreferenceQuestion;
        default: return null;
    }
});

async function handleAnswer(answer) {
    const questionId = currentQuestion.value.id;

    await store.submitAnswer(questionId, answer);

    // Check if finished
    if (store.currentQuestionIndex >= store.study.questions.length) {
        await store.completeStudy();
        router.push('/thank-you');
    }
}
</script>
