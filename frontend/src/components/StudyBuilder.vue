<template>
    <div class="study-builder">
        <QuestionListSidebar />
        <QuestionEditorPanel />
    </div>

    <div class="submit-container">
        <button @click="submitStudy">🚀 Submit Study</button>
    </div>
</template>

<script setup>
import { useStudyStore } from '@/store/studyStore';
import QuestionListSidebar from './StudyBuilder/QuestionListSidebar.vue';
import QuestionEditorPanel from './StudyBuilder/QuestionEditorPanel.vue';
import api from '@/api/axios';

const store = useStudyStore();

async function submitStudy() {
    const formData = new FormData();

    formData.append('title', store.title);
    formData.append('description', store.description);
    formData.append('consent', store.consent);
    formData.append('demographics', JSON.stringify(store.demographics));

    store.questions.forEach((q, i) => {
        formData.append(`questions[${i}][type]`, q.type);
        formData.append(`questions[${i}][config]`, JSON.stringify(q.config || {}));

        q.files?.forEach((file, j) => {
            formData.append(`questions[${i}][files][${j}]`, file);
        });
    });

    try {
        const res = await api.post('/studies', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Study submitted successfully!');
        console.log(res.data);
    } catch (err) {
        alert('Error submitting study');
        console.error(err);
    }
}
</script>

<style scoped>
.study-builder {
    display: flex;
    height: calc(100% - 60px);
    /* leave space for button */
}

button {
    padding: 0.5rem 1.2rem;
    font-size: 1rem;
    cursor: pointer;
    position: absolute;
    right: 1rem;
    bottom: 1rem;
}
</style>
