import { defineStore } from 'pinia';

export const useStudyStore = defineStore('study', {
    state: () => ({
        title: '',
        description: '',
        consent: '',
        demographics: [],
        questions: [],
        selectedQuestionIndex: null,
    }),
    actions: {
        addQuestion(question) {
            this.questions.push(question);
        },
        updateQuestion(index, question) {
            this.questions[index] = question;
        },
        removeQuestion(index) {
            this.questions.splice(index, 1);
            if (this.selectedQuestionIndex === index) {
                this.selectedQuestionIndex = null;
            }
        },
        setSelectedQuestion(index) {
            this.selectedQuestionIndex = index;
        }
    }
});
