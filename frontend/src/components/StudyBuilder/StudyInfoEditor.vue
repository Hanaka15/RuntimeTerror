<template>
    <div class="study-info">
        <h2>Study Info</h2>

        <label>Title</label>
        <input v-model="store.title" type="text" />

        <label>Description</label>
        <textarea v-model="store.description" rows="4" />

        <label>Consent Form</label>
        <textarea v-model="store.consent" rows="6" placeholder="Paste your consent form text..." />

        <label>Demographic Fields</label>
        <div v-for="(field, index) in store.demographics" :key="index" class="field-row">
            <input v-model="field.label" placeholder="Field Label" />
            <select v-model="field.type">
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="select">Select</option>
            </select>
            <button @click="removeDemographic(index)">Remove</button>
        </div>
        <button @click="addDemographic">+ Add Demographic Field</button>
    </div>
</template>

<script setup>
import { useStudyStore } from '@/store/studyStore';
const store = useStudyStore();

function addDemographic() {
    store.demographics.push({ label: '', type: 'text' });
}

function removeDemographic(index) {
    store.demographics.splice(index, 1);
}
</script>

<style scoped>
.study-info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.field-row {
    display: flex;
    gap: 0.5rem;
}
</style>
