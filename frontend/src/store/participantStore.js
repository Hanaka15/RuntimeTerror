// src/store/useParticipantStore.js
import { defineStore } from 'pinia';
import axios from '@/api/axios';

export const useParticipantStore = defineStore('participant', {
  state: () => ({
    participant: null,
    study: null, 
    demographicsSchema: null,
    consentText: '',
    collaborators: [],
    currentQuestionIndex: 0,
  }),

  actions: {
    async initStudy(participantId) {
      try {
        // Matches backend: GET /init/:participantId
        const { data } = await axios.get(`/sessions/init/${participantId}`);

        this.participant = data.participant;
        this.study = data.study;
        this.demographicsSchema = data.study?.demographics || null;
        this.consentText = data.study?.consent || '';
        this.collaborators = data.study?.collaborators || [];
        this.currentQuestionIndex = data.participant?.answers?.length || 0;

        // Log state for debugging
        console.log('initStudy:', {
          participant: this.participant,
          study: this.study,
          demographicsSchema: this.demographicsSchema,
          consentText: this.consentText,
          collaborators: this.collaborators,
          currentQuestionIndex: this.currentQuestionIndex
        });
      } catch (error) {
        throw new Error('Failed to initialize study: ' + (error.response?.data?.error || error.message));
      }
    },

    async submitParticipantInfo(demographics, consentAccepted) {
      if (!this.participant?._id) throw new Error('No participant loaded');
      // Convert demographics object to array of { name, value }
      const demographicsArray = Object.entries(demographics).map(([name, value]) => ({ name, value }));
      await axios.post(`/sessions/submit-participant/${this.participant._id}`, {
        demographics: demographicsArray,
        consentAccepted,
      });
      this.participant.demographics = demographicsArray;
      this.participant.consent = consentAccepted;

      // Log state for debugging
      console.log('submitParticipantInfo:', {
        demographics: this.participant.demographics,
        consent: this.participant.consent
      });
    },

    async submitAnswer(questionId, answer) {
      if (!this.participant?._id) throw new Error('No participant loaded');
      // Matches backend: POST /submit-answer/:id
      await axios.post(`/sessions/submit-answer/${this.participant._id}`, {
        questionId,
        answer,
      });
      this.participant.answers = [
        ...(this.participant.answers || []),
        { questionId, response: answer }
      ];
      this.currentQuestionIndex++;

      // Log state for debugging
      console.log('submitAnswer:', {
        answers: this.participant.answers,
        currentQuestionIndex: this.currentQuestionIndex
      });
    },

    async completeStudy() {
      if (!this.participant?._id) throw new Error('No participant loaded');
      // Matches backend: POST /complete-study/:id
      await axios.post(`/sessions/complete-study/${this.participant._id}`);

      // Log state for debugging
      console.log('completeStudy:', {
        participant: this.participant
      });
    }
  }
});
