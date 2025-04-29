<template>
    <div class="create-study-container">
      <div class="left-side">
        <QuestionList @add-question="addQuestion" @select-question="selectQuestion" :questions="study.questions" />
      </div>
  
      <div class="right-side">
        <!-- Study Info Section -->
        <StudyInfo :study="study" @update-study="updateStudy" />
  
        <!-- Question Settings Section -->
        <div v-if="selectedQuestion">
          <h3>Question Settings</h3>
  
          <!-- Dynamically Render the Right Question Component -->
          <component :is="selectedQuestionComponent" v-bind="selectedQuestionData" @update="updateQuestionData" />
  
          <!-- Change Question Type -->
          <select v-model="selectedQuestion.type" @change="changeQuestionType">
            <option value="multiple_choice">Multiple Choice</option>
            <option value="slider">Slider</option>
            <option value="rank">Rank</option>
          </select>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import QuestionList from './QuestionList.vue';
  import StudyInfo from './StudyInfo.vue';
  import MultipleChoice from './questions/MultipleChoice.vue';
  import Slider from './questions/Slider.vue';
  import Rank from './questions/Rank.vue';
  
  export default {
    components: {
      QuestionList,
      StudyInfo,
      MultipleChoice,
      Slider,
      Rank
    },
    data() {
      return {
        study: {
          name: '',
          consent: '',
          demographics: [],
          questions: []
        },
        selectedQuestion: null,
        selectedQuestionComponent: null,
        selectedQuestionData: null,
      };
    },
    methods: {
      // Add a new question
      addQuestion() {
        const newQuestion = {
          name: 'New Question',
          type: 'multiple_choice',
          questionText: '',
          choices: ['Option 1', 'Option 2', 'Option 3'],
        };
        this.study.questions.push(newQuestion);
        this.selectQuestion(this.study.questions.length - 1); // Select the new question automatically
      },
  
      // Select a question and set it as the active one to edit
      selectQuestion(index) {
        this.selectedQuestion = this.study.questions[index];
        this.selectedQuestionComponent = this.getQuestionComponent(this.selectedQuestion.type);
        this.selectedQuestionData = { ...this.selectedQuestion }; // Deep copy of selected question data
      },
  
      // Change the type of the selected question and update the component
      changeQuestionType() {
        this.selectedQuestionComponent = this.getQuestionComponent(this.selectedQuestion.type);
      },
  
      // Determine the appropriate question component based on the type
      getQuestionComponent(type) {
        switch (type) {
          case 'multiple_choice':
            return 'MultipleChoice';
          case 'slider':
            return 'Slider';
          case 'rank':
            return 'Rank';
          default:
            return null;
        }
      },
  
      // Update study information
      updateStudy(newStudyInfo) {
        this.study.name = newStudyInfo.name;
        this.study.consent = newStudyInfo.consent;
        this.study.demographics = newStudyInfo.demographics;
      },
  
      // Update question data after any change within the question component
      updateQuestionData(updatedData) {
        const index = this.study.questions.indexOf(this.selectedQuestion);
        if (index !== -1) {
          this.study.questions[index] = { ...updatedData }; // Update question with new data
        }
      },
    }
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
  
  button {
    margin-top: 10px;
    padding: 5px 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }
  </style>
  