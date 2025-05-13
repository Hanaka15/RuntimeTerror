<template>
  <div class="answer-quiz">
    <div class="progress-bar-wrapper" v-if="sessionStarted">
      <div class="progress-bar-fill" :style="{ width: progressPercent + '%' }"></div>
    </div>

    <ConsentDemographics v-if="!sessionStarted && study" :study="study" :studyId="$route.params.study_id"
      @session-started="handleSessionStarted" />

    <div v-if="study && sessionStarted" class="quiz-container">
      <div class="question-content" v-if="currentQuestion">
        <MultipleChoiceAnswer v-if="currentQuestion.type === 'multiple_choice'" :question="currentQuestion"
          :modelValue="answers[currentQuestion._id]" @update:modelValue="handleAnswer" />

        <RankAnswer v-else-if="currentQuestion.type === 'rank'" :question="currentQuestion"
          :modelValue="answers[currentQuestion._id]" @update:modelValue="handleAnswer" />

        <SliderAnswer v-else-if="currentQuestion.type === 'slider'" :question="currentQuestion"
          :modelValue="answers[currentQuestion._id]" @update:modelValue="handleAnswer" />

        <p v-else>Error loading question</p>
      </div>

      
    </div>
    <div v-if="study && sessionStarted" class="navigation-buttons">
        <button v-if="currentIndex > 0" @click="previousQuestion">Previous</button>
        <button v-if="currentIndex < totalCount - 1" @click="nextQuestion">Next</button>
        <button v-else @click="submitAnswers">Finish Survey</button>
      </div>
  </div>
</template>

<script>
import axios from "@/api/axios";
import ConsentDemographics from "../components/answers/ConsentDemographics.vue";
import MultipleChoiceAnswer from "../components/answers/MultipleChoiceAnswer.vue";
import RankAnswer from "../components/answers/RankAnswer.vue";
import SliderAnswer from "../components/answers/SliderAnswer.vue";

export default {
  components: {
    ConsentDemographics,
    MultipleChoiceAnswer,
    RankAnswer,
    SliderAnswer,
  },
  data() {
    return {
      study: null,
      sessionId: null,
      answers: {},
      currentIndex: 0,
      sessionStarted: false,
    };
  },
  computed: {
    currentQuestion() {
      return this.study?.questions?.[this.currentIndex] || null;
    },
    answeredCount() {
      return Object.values(this.answers).filter(v => v !== null && v !== "").length;
    },
    totalCount() {
      return this.study?.questions?.length || 0;
    },
    progressPercent() {
      if (this.totalCount === 0) return 0;
      return Math.round((this.answeredCount / this.totalCount) * 100);
    },
  },
  methods: {
    async fetchStudy() {
      const studyId = this.$route.params.study_id;
      try {
        const res = await axios.get(`/studies/${studyId}`, {
          withCredentials: true,
        });
        this.study = res.data;
      } catch (error) {
        console.error("Failed to load study", error);
      }
    },

    handleSessionStarted(sessionId) {
      this.sessionId = sessionId;
      this.sessionStarted = true;
    },

    nextQuestion() {
      if (this.currentIndex < this.totalCount - 1) {
        this.currentIndex++;
      }
    },

    previousQuestion() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
    },

    handleAnswer(value) {
      const question = this.currentQuestion;

      if (!question || !question._id) return;

      if (question.type === "rank") {
        if (Array.isArray(value) && value.length === question.items.length) {
          this.answers[question._id] = value;
        } else {
          delete this.answers[question._id]; 
        }
      } else if (question.type === "slider") {
        if (value !== null && value !== undefined && value !== "") {
          this.answers[question._id] = value;
        } else {
          delete this.answers[question._id];
        }
      } else {
        if (value !== null && value !== "") {
          this.answers[question._id] = value;
        } else {
          delete this.answers[question._id];
        }
      }
    },

    async submitAnswers() {
      try {
        const answerArray = Object.entries(this.answers).map(
          ([questionId, response]) => ({
            questionId,
            response,
          })
        );

        await axios.post(`/sessions/${this.sessionId}/answers`, {
          answers: answerArray,
        });


        //placeholder
        alert("Thank you");
      } catch (error) {
        console.error("Failed to submit answers", error);
      }
    },
  },
  mounted() {
    this.fetchStudy();
  },
};
</script>

<style lang="scss" scoped>
.answer-quiz {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.quiz-container {
  width: 50vw;
  height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  box-sizing: border-box;
}

.question-block {
  margin-bottom: 2rem;
}

.progress-bar-wrapper {
  height: 8px;
  background-color: #eee;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;

  .progress-bar-fill {
    height: 100%;
    background-color: #4caf50;
    transition: width 0.3s ease;
  }
}

.navigation-buttons {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}
</style>

