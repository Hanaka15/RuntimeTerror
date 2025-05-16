<template>
    <div v-if="store.demographicsSchema && store.consentText">
        <h1>Welcome to the Study</h1>

        <ConsentForm v-model="consentAccepted" :text="store.consentText" />

        <DemographicsForm v-model="demographics" :schema="store.demographicsSchema" @submitted="handleSubmit" />

        <p v-if="error" class="error">{{ error }}</p>
    </div>

    <div v-else-if="loading">
        <p>Loading study...</p>
    </div>

    <div v-else>
        <p>Study not found or unavailable.</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useParticipantStore } from '@/store/participantStore';
import ConsentForm from './ConsentForm.vue';
import DemographicsForm from './DemograpicsForm.vue';

const store = useParticipantStore();
const route = useRoute();
const router = useRouter();

const participantId = route.params.participantId;
const loading = ref(true);
const error = ref(null);

const demographics = ref({});
const consentAccepted = ref(false);

onMounted(async () => {
    try {
        await store.initStudy(participantId);
    } catch (err) {
        error.value = err.message;
    } finally {
        loading.value = false;
    }
});

async function handleSubmit() {
    if (!consentAccepted.value) {
        error.value = 'You must accept the consent form to continue.';
        return;
    }

    try {
        await store.submitParticipantInfo(demographics.value, consentAccepted.value);
        router.push('/study');
    } catch (err) {
        error.value = 'Failed to submit: ' + err.message;
    }
}
</script>

<style scoped>
.error {
    color: red;
}
</style>
