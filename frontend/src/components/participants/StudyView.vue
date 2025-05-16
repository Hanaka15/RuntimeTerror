<template>
    <div v-if="store.study && typeof store.currentQuestionIndex === 'number' && currentQuestion">
        <RankingQuestion
            v-if="currentQuestion.type === 'ranking'"
            :question="currentQuestion"
            @answered="handleAnswer"
        />
        <PreferenceQuestion
            v-else-if="currentQuestion.type === 'preference'"
            :question="currentQuestion"
            @answered="handleAnswer"
        />
        <SliderQuestion
            v-else-if="currentQuestion.type === 'slider'"
            :question="currentQuestion"
            @answered="handleAnswer"
        />
        <div v-else>
            <p>Invalid or unsupported question type.</p>
        </div>
    </div>
    <div v-else>
        <p>Loading question...</p>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useParticipantStore } from '@/store/participantStore';

import RankingQuestion from './questions/RankingQuestion.vue';
import PreferenceQuestion from './questions/PreferenceQuestion.vue';
import SliderQuestion from './questions/SliderQuestion.vue';

const router = useRouter();
const route = useRoute();
const store = useParticipantStore();

const currentQuestion = computed(() => {
    if (!store.study || !Array.isArray(store.study.questions)) return null;
    return store.study.questions[store.currentQuestionIndex] || null;
});

function isQuestionValid(question) {
    if (!question) return false;
    if (['ranking', 'preference'].includes(question.type)) {
        if (!Array.isArray(question.options)) {
            question.options = question.files || [];
        }
        return Array.isArray(question.options) && question.options.length > 0;
    }
    if (question.type === 'slider') {
        return typeof question.min === 'number' && typeof question.max === 'number' && typeof question.step === 'number';
    }
    return typeof question.question === 'string' && question.question.length > 0;
}

if (!store.study || !store.participant) {
    const participantId = route.params.participantId;
    store.initStudy(participantId);
}

async function handleAnswer(answer) {
    const questionId = currentQuestion.value._id || currentQuestion.value.id;
    await store.submitAnswer(questionId, answer);

    if (store.currentQuestionIndex >= (store.study?.questions?.length || 0)) {
        await store.completeStudy();
        router.push(`/participant/${route.params.participantId}/thank-you`);
    }
}
</script>
