<template>
    <h2>Study Info</h2>
    <div class="study-info">
        <div class="study-details">
            <label>Title</label>
            <input v-model="store.title" type="text" />

            <label>Description</label>
            <textarea v-model="store.description" rows="4" />

            <label>Consent Form</label>
            <textarea v-model="store.consent" rows="6" placeholder="Paste your consent form text..." />
        </div>
        <div class="demographics">
            <label>Demographic Fields</label>
            <div v-for="(field, index) in store.demographics" :key="index" class="field-row">
                <input v-model="field.label" placeholder="Field Label" />
                <select v-model="field.type">
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="select">Select</option>
                </select>
                <button type="button" @click="removeDemographic(index)">Remove</button>
            </div>
            <button type="button" @click="addDemographic" class="add-demo-btn">+ Add Demographic Field</button>
        </div>
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

<style lang="scss" scoped>
.study-info {
    margin: 2rem auto 0 auto;
    padding: 0 2rem;
    width: 100%;
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr 1fr;
}

.study-info label {
    font-weight: 500;
    margin-bottom: 0.2rem;
}

.study-info input[type="text"],
.study-info textarea,
.study-info select {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    box-sizing: border-box;
}

.field-row {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-bottom: 0.5rem;
}

.field-row input[type="text"] {
    flex: 2;
    min-height: 2.5rem;
}

.field-row select {
    min-height: 2.5rem;
    flex: 1;
}

.field-row button {
    flex: 0 0 auto;
    padding: 0.3rem 0.8rem;
    min-height: 2.5rem;
    font-size: 0.95rem;
    cursor: pointer;
}

.add-demo-btn {
    align-self: flex-start;
    padding: 0.7rem 1.2rem;
    font-size: 1rem;
    cursor: pointer;
}

.study-details, .demographics {
    display: flex;
    flex-direction: column;
    gap: .2rem;
    & > input {
        min-height: 2.5rem;
    }
}

</style>
