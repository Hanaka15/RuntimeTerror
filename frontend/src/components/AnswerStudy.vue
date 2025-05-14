<template>
  <div class="dot-plane">
    <div class="dot-grid"></div>
  </div>

  <div class="answer-quiz">
    <Results v-if="quizCompleted" />

    <template v-else>
      <ConsentDemographics v-if="!sessionStarted && study" :study="study" :studyId="$route.params.study_id"
        @session-started="handleSessionStarted" />

      <div v-if="study && sessionStarted" class="quiz-container">
        <div class="question-content" v-if="currentQuestion">
          <MultipleChoiceAnswer v-if="currentQuestion.type === 'multiple_choice'" :question="currentQuestion"
            :modelValue="answers[currentQuestion._id]" @update:modelValue="handleAnswer" />

          <RankAnswer v-else-if="currentQuestion.type === 'rank'" :key="currentQuestion._id" :question="currentQuestion"
            :modelValue="answers[currentQuestion._id]" @update:modelValue="handleAnswer" />

          <SliderAnswer v-else-if="currentQuestion.type === 'slider'" :question="currentQuestion"
            :modelValue="answers[currentQuestion._id]" @update:modelValue="handleAnswer" />

          <p v-else>Error loading question</p>
        </div>

        <div class="navigation-buttons">
          <button @click="handleExit">
            {{ currentIndex === 0 ? 'Exit' : 'Previous' }}
          </button>
          <button v-if="currentIndex < totalCount - 1" @click="nextQuestion">
            Next
          </button>
          <button v-else @click="submitAnswers" :disabled="answeredCount !== totalCount">
            Finish Survey
          </button>
        </div>

        <div class="question-tracker">
          <span v-for="(q, i) in questionStatusList" :key="q.index"
            :class="['tracker', { answered: q.answered, current: q.isCurrent }]" @click="currentIndex = i">
            {{ q.index }}
          </span>
        </div>
      </div>
    </template>
  </div>
</template>


<script>
import axios from "@/api/axios";
import ConsentDemographics from "../components/answers/ConsentDemographics.vue";
import MultipleChoiceAnswer from "../components/answers/MultipleChoiceAnswer.vue";
import RankAnswer from "../components/answers/RankAnswer.vue";
import SliderAnswer from "../components/answers/SliderAnswer.vue";
import Results from "./answers/Results.vue";

export default {
  components: {
    ConsentDemographics,
    MultipleChoiceAnswer,
    RankAnswer,
    SliderAnswer,
    Results,
  },
  data() {
    return {
      study: null,
      sessionId: null,
      answers: {},
      currentIndex: 0,
      sessionStarted: false,
      quizCompleted: false,
    };
  },
  computed: {
    currentQuestion() {
      return this.study?.questions?.[this.currentIndex] || null;
    },
    answeredCount() {
      return Object.values(this.answers).filter((v) => v !== null && v !== "")
        .length;
    },
    totalCount() {
      return this.study?.questions?.length || 0;
    },
    progressPercent() {
      if (this.totalCount === 0) return 0;
      return Math.round((this.answeredCount / this.totalCount) * 100);
    },

    questionStatusList() {
      return this.study?.questions?.map((q, index) => {
        const id = q._id;
        return {
          index: index + 1,
          answered: this.answers[id] !== undefined && this.answers[id] !== null && this.answers[id] !== "",
          isCurrent: this.currentIndex === index,
        };
      }) || [];
    }
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

    handleExit() {
      if (this.currentIndex === 0) {
        const confirmExit = confirm('Are you sure you want to exit? Unsaved answers may be lost');
        if (confirmExit) {
          this.sessionStarted = false;
        }
      } else {
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

        this.quizCompleted = true;
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
  height: 100vh;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.quiz-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5rem;
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
  background-color: var(--background-alt);
  box-sizing: border-box;
  width: 70vw;
  height: 80vh;
  position: relative;

  .question-content {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
}

.question-block {
  margin-bottom: 2rem;
}

.navigation-buttons {
  display: flex;
  margin-top: auto;
  padding-bottom: 5rem;
  gap: 1rem;
  margin-bottom: 1rem;
}


.progress-bar-wrapper {
  height: 8px;
  background-color: #eee;
  width: 100%;
  border-radius: 0 0 var(--border-radius) var(--border-radius);
  flex-shrink: 0;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;

  .progress-bar-fill {
    height: 100%;
    background-color: #4caf50;
    transition: width 0.3s ease;
  }
}

.question-counter {
  margin-top: 1rem;
}

.question-tracker {
  display: flex;
  justify-content: space-between;
  flex: 1;
  margin-top: 1rem;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  transition: all 2s;
}

.tracker {
  flex: 1;
  text-align: center;
  border-right: 1px solid var(--border);
  border-top: 4px solid darkgray;
  cursor: pointer;
  padding: 2rem 0;
  transition: border-top-color 0.6s;

  &:last-child {
    border-right: none;
  }

  &:hover {
    background-color: var(--background);
    cursor: pointer;
  }

  &.answered {
    border-top: 4px solid #4caf50;
    color: white;
  }

  &.current {
    font-weight: bold;
  }
}

.dot-plane {
  position: fixed;
  inset: 0;
  background: #161f27;
  overflow: hidden;
  z-index: -1;
  perspective: 800px;
  width: 100vw;
  height: 100vh;
}

.dot-grid {
  pointer-events: none;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 550vw;
  height: 550vh;
  z-index: -1;
  transform: translate(-50%, -50%) rotateX(65deg);
  background-image: radial-gradient(#ffffff 1px, transparent 1px);
  background-size: 30px 30px;
  animation: scrollGrid 30s linear infinite;
  opacity: 0.2;
  will-change: transform;
}

@keyframes scrollGrid {
  from {
    transform: translate(-50%, -50%) rotateX(50deg) rotateZ(40deg) translate(0);
  }

  to {
    transform: translate(-50%, -50%) rotateX(50deg) rotateZ(40deg) translate(-400px);
  }
}

@media screen and (max-width: 900px) {
  .quiz-container {
    width: 90%;
    background-color: transparent;
    border: none;
  }

  .question-tracker {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    padding: 0.5rem 0;
  }

  .tracker {
    background-color: var(--background);
    padding: 1rem 0;

    &:hover {
      background-color: var(--background-alt);
    }
  }
}
</style>
