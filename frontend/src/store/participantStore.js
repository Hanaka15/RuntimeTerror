// src/store/useParticipantStore.js
import { defineStore } from 'pinia';
import axios from '@/api/axios';

export const useParticipantStore = defineStore('participant', {
  state: () => ({
    participantId: null,
    demographicsSchema: null,
    consentText: '',
    study: null,
    demographics: {},
    consentAccepted: false,
    answers: [],
    currentQuestionIndex: 0,
  }),

  actions: {
    async initStudy(participantId) {
      try {
        const { data } = await axios.get(`/api/init/${participantId}`);

        this.participantId = participantId;
        this.demographicsSchema = data.demographics;
        this.consentText = data.consent;
        this.study = data.study;
        this.currentQuestionIndex = data.currentQuestionIndex || 0;
        this.answers = data.answers || [];
      } catch (error) {
        throw new Error('Failed to initialize study: ' + error.response?.data?.error || error.message);
      }
    },

    async submitParticipantInfo(demographics, consentAccepted) {
      await axios.post(`/api/submit-participant/${this.participantId}`, {
        demographics,
        consentAccepted,
      });
      this.demographics = demographics;
      this.consentAccepted = consentAccepted;
    },

    async submitAnswer(questionId, answer) {
      await axios.post(`/api/submit-answer/${this.participantId}`, {
        questionId,
        answer,
      });

      this.answers.push({ questionId, answer });
      this.currentQuestionIndex++;
    },

    async completeStudy() {
      await axios.post(`/api/complete-study/${this.participantId}`);
    }
  }
});
