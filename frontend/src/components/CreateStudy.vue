<template>
  <div class="create-study-container">
    <div class="left-side">
      <QuestionList
        :questions="study.questions"
        :modeValue="selectedQuestionIndex"
        @add-question="addQuestion"
        @select-question="selectQuestion"
      />
    </div>

    <div class="right-side">
      <!-- Study Info Section -->
      <StudyInfo
        :study="study"
        @update-study="updateStudy"
        @add-question="addQuestion"
      />

      <!-- Question Settings Section -->
      <div v-if="selectedQuestion">
        <h3>Question Settings</h3>
        <select v-model="selectedQuestion.type" @change="changeQuestionType">
          <option value="multiple_choice">Multiple Choice</option>
          <option value="slider">Slider</option>
          <option value="rank">Rank</option>
          <option value="preference">Comparison</option>
        </select>

        <!-- Dynamically Render the Right Question Component -->
        <component
          :is="selectedQuestionComponent"
          :questionData="selectedQuestionData"
          @update="updateQuestionData"
        />

        <!-- Change Question Type -->
      </div>
    </div>
  </div>
</template>

<script>
import QuestionList from "./QuestionList.vue";
import StudyInfo from "./StudyInfo.vue";
import MultipleChoice from "./questions/MultipleChoice.vue";
import Slider from "./questions/Slider.vue";
import Rank from "./questions/Rank.vue";
import Preference from "./questions/Preference.vue";
import api from "../api/axios";
import FileUpload from "./questions/fileUpload.vue";

export default {
  components: {
    QuestionList,
    StudyInfo,
    MultipleChoice,
    Slider,
    Rank,
    Preference,
  },
  data() {
    return {
      study: {
        id: null,
        name: "",
        consent: "",
        demographics: [],
        questions: [],
      },
      selectedQuestionIndex: null,
      selectedQuestion: null,
      selectedQuestionComponent: null,
      selectedQuestionData: null,
    };
  },

  async mounted() {
    const studyId = this.$route.params.study_id;
    if (studyId) {
      try {
        const response = await api.get(`/studies/${studyId}`);
        this.study = response.data;
        this.study.id = response.data._id; // normalize the id key
      } catch (error) {
        console.error('Failed to load study for editing:', error);
        alert('Could not load study for editing.');
      }
    }
  },

  methods: {
    // Add a new question
    addQuestion(type = "multiple_choice") {
      let newQuestion;

      switch (type) {
        case "multiple_choice":
          newQuestion = {
            name: "New Question",
            type,
            question: "",
            choices: ["Option 1", "Option 2", "Option 3"],
          };
          break;

        case "slider":
          newQuestion = {
            name: "New Question",
            type,
            question: "",
            min: 0,
            max: 100,
            step: 1,
            defaultValue: 50,
          };
          break;

        case "rank":
          newQuestion = {
            name: "New Question",
            type,
            question: "",
            items: ["Artifact 1", "Artifact 2"],
            allowTie: false,
          };
          break;

        case "preference":
          newQuestion = {
            name: "New Question",
            type,
            question: "",
            pairs: [{ left: "", right: "" }],
          };
          break;

        default:
          newQuestion = {
            name: "New Question",
            type,
            question: "",
          };
      }

      this.study.questions.push(newQuestion);
      this.selectQuestion(this.study.questions.length - 1); // Select the new question automatically
    },

    // Select a question and set it as the active one to edit
    selectQuestion(index) {
      this.selectedQuestionIndex = index;
      this.selectedQuestion = this.study.questions[index];
      this.selectedQuestionComponent = this.getQuestionComponent(
        this.selectedQuestion.type
      );
      this.selectedQuestionData = JSON.parse(
        JSON.stringify(this.selectedQuestion)
      ); // Deep copy of selected question data
    },

    // Change the type of the selected question and update the component
    changeQuestionType() {
      const questionBase = {
        name: this.selectedQuestion.name,
        type: this.selectedQuestion.type,
        question: this.selectedQuestion.question || "",
      };

      delete this.selectedQuestion.choices;
      delete this.selectedQuestion.items;
      delete this.selectedQuestion.min;
      delete this.selectedQuestion.max;
      delete this.selectedQuestion.step;
      delete this.selectedQuestion.defaultValue;
      delete this.selectedQuestion.allowTie;
      delete this.selectedQuestion.pairs;

      switch (this.selectedQuestion.type) {
        case "multiple_choice":
          Object.assign(this.selectedQuestion, {
            ...questionBase,
            choices: ["Option 1", "Option 2", "Option 3"],
          });
          break;

        case "slider":
          Object.assign(this.selectedQuestion, {
            ...questionBase,
            min: this.selectedQuestion.min ?? 0,
            max: this.selectedQuestion.max ?? 100,
            step: this.selectedQuestion.step ?? 1,
            defaultValue:
              this.selectedQuestion.defaultValue ??
              (this.selectedQuestion.min + this.selectedQuestion.max) / 2,
          });
          break;

        case "rank":
          Object.assign(this.selectedQuestion, {
            ...questionBase,
            items: this.selectedQuestion.items || ["Artifact 1", "Artifact 2"],
            allowTie: this.selectedQuestion.allowTie ?? false,
          });
          break;

        case "preference":
          Object.assign(this.selectedQuestion, {
            ...questionBase,
            pairs: this.selectedQuestion.pairs || [
              { left: "Left", right: "Right" },
            ],
          });
          break;
      }

      this.selectedQuestionComponent = this.getQuestionComponent(
        this.selectedQuestion.type
      );
      this.selectedQuestionData = JSON.parse(
        JSON.stringify(this.selectedQuestion)
      );
    },

    // Determine the appropriate question component based on the type
    getQuestionComponent(type) {
      switch (type) {
        case "multiple_choice":
          return "MultipleChoice";
        case "slider":
          return "Slider";
        case "rank":
          return "Rank";
        case "preference":
          return "Preference";
        default:
          return null;
      }
    },

    //Update/save study info
    async updateStudy(newStudyInfo) {
      try {
        // if there's no id, it's a new study, save it as draft
        if (!newStudyInfo.id) {
          //newStudyInfo.id = this.study.id;
          newStudyInfo.published = false;

          console.log(
            "Submitting study:",
            JSON.stringify(newStudyInfo, null, 2)
          );

          const response = await api.post("/studies", newStudyInfo);

          this.study = response.data.study;
          newStudyInfo.id = response.data.study._id;
          this.study.id = response.data.study._id;
          alert("study saved as draft");
        } else {
          console.log("Updating study:", JSON.stringify(newStudyInfo, null, 2));
          const response = await api.patch(
            `/studies/${newStudyInfo.id}`,
            newStudyInfo
          );

          this.study = response.data.study;
          this.study.id = response.data.study._id;
          alert("study updated successfully");
        }
      } catch (error) {
        console.error("Error saving: ", error);
        alert(
          "Save failed: " + (error.response?.data?.message || error.message)
        );
      }
    },

    // Update question data after any change within the question component
    updateQuestionData(updatedData) {
      console.log("Updated Data Received in Parent:", updatedData);
      Object.assign(this.selectedQuestion, updatedData); // maintains Vue reactivity

      const index = this.selectedQuestionIndex;
      if (index !== -1) {
        this.study.questions.splice(index, 1, { ...this.selectedQuestion });
      }
    },
  },
};
</script>

<style scoped>
.create-study-container {
  display: flex;
}

.left-side {
  width: 25%;
  padding: 10px;
  border-right: 1px solid #ccc;
}

.right-side {
  width: 75%;
  padding: 10px;
}

button:hover {
  background-color: #45a049;
}
</style>
