<template>
    <div v-if="store.demographicsSchema && store.consentText" class="start-view">
        <h1>Welcome to the Study</h1>

        <section class="consent-section">
            <h2>Consent Form</h2>
            <div class="consent-text">
                {{ store.consentText }}
            </div>
            <label class="consent-checkbox">
                <input type="checkbox" v-model="consentAccepted" />
                I have read and agree to the consent form above.
            </label>
        </section>

        <section class="demographics-section">
            <DemographicsForm v-model="demographics" :schema="store.demographicsSchema" @submitted="handleSubmit" />
        </section>

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
import { ref, onMounted, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useParticipantStore } from '@/store/participantStore';
// ConsentForm import removed, not needed
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
        error.value = err.message || 'Failed to load study';
    } finally {
        loading.value = false;
    }
});

// Redirect if already consented
watchEffect(() => {
    if (store.participant?.consent) {
        if (store.currentQuestionIndex >= (store.study?.questions?.length || 0)) {
            router.push(`/participant/${participantId}/thank-you`);
        } else {
            router.push(`/participant/${participantId}/study`);
        }
    }
});

async function handleSubmit() {
    if (!consentAccepted.value) {
        error.value = 'You must accept the consent form to continue.';
        return;
    }

    try {
        await store.submitParticipantInfo(demographics.value, consentAccepted.value);
        router.push(`/participant/${participantId}/study`);
    } catch (err) {
        error.value = 'Failed to submit: ' + err.message;
    }
}
</script>

<style lang="scss" scoped>
.start-view {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem 2.5rem;
    border-radius: 10px;
}

h1 {
    text-align: center;
    margin-bottom: 2rem;
}

.consent-section {
    margin-bottom: 2.5rem;
    border-radius: 8px;
}

.consent-section h2 {
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: 1.2rem;
}

.consent-text {
    white-space: pre-line;
    margin-bottom: 1rem;
    font-size: 1rem;
    line-height: 1.6;
    padding: 0.5rem 0.75rem;
    background-color: var(--background-alt);
    border-radius: 6px;
}

.consent-checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;        .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
    margin-top: 0.5rem;
}

.demographics-section {
    margin-top: 2rem;
}

.error {
    color: red;
    margin-top: 1.5rem;
    text-align: center;
}
</style>
