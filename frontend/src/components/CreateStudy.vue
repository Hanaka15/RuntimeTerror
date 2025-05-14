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
        <component :is="selectedQuestionComponent" :questionData="selectedQuestionData" @update="updateQuestionData" />

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
  import api from '../api/axios';
  
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
      addQuestion(type = 'multiple_choice') {
        let newQuestion;

        switch (type) {
          case 'multiple_choice':
            newQuestion = {
              name: 'New Question',
              type,
              question: '',
              choices: ['Option 1', 'Option 2', 'Option 3']
            };
            break;
          
          case 'slider':
            newQuestion = {
              name: 'New Question',
              type,
              question: '',
              min: 0,
              max: 100,
              step: 1,
              defaultValue: 50
            };
            break;

          case 'rank':
            newQuestion = {
              name: 'New Question',
              type,
              question: '',
              items: ['Artifact 1', 'Artifact 2'],
              allowTie: false
            };
            break;
          
          default:
            newQuestion = {
              name: 'New Question',
              type,
              question: ''
            }
          }

        this.study.questions.push(newQuestion);
        this.selectQuestion(this.study.questions.length - 1); // Select the new question automatically 
      },
  
      // Select a question and set it as the active one to edit
      selectQuestion(index) {
        this.selectedQuestion = this.study.questions[index];
        this.selectedQuestionComponent = this.getQuestionComponent(this.selectedQuestion.type);
        this.selectedQuestionData =  JSON.parse(JSON.stringify(this.selectedQuestion)); // Deep copy of selected question data
      },
  
      // Change the type of the selected question and update the component
      changeQuestionType() {
        const questionBase = {
          name: this.selectedQuestion.name,
          type: this.selectedQuestion.type,
          question: this.selectedQuestion.question || '',
        };

        delete this.selectedQuestion.choices;
        delete this.selectedQuestion.items;
        delete this.selectedQuestion.items;
        delete this.selectedQuestion.min;
        delete this.selectedQuestion.max;
        delete this.selectedQuestion.minValue;
        delete this.selectedQuestion.maxValue;
        delete this.selectedQuestion.step;
        delete this.selectedQuestion.defaultValue;
        delete this.selectedQuestion.allowTie;

        switch (this.selectedQuestion.type) {
          case 'multiple_choice':
            Object.assign(this.selectedQuestion, {
              ...questionBase,
              choices: ['Option 1', 'Option 2', 'Option 3']
            });
            break;
          
          case 'slider':
            Object.assign(this.selectedQuestion, {
              ...questionBase,
              min: this.selectedQuestion.min ?? 0,
              max: this.selectedQuestion.max ?? 100,
              step: this.selectedQuestion.step ?? 1,
              defaultValue: this.selectedQuestion.defaultValue ?? ((this.selectedQuestion.min + this.selectedQuestion.max) / 2)
            }); 
            break;

          case 'rank':
            Object.assign(this.selectedQuestion, {
              ...questionBase,
              items: this.selectedQuestion.items || ['Artifact 1', 'Artifact 2'],
              allowTie: this.selectedQuestion.allowTie ?? false
            });
            break;
        }

        this.selectedQuestionComponent = this.getQuestionComponent(this.selectedQuestion.type);
        this.selectedQuestionData = JSON.parse(JSON.stringify(this.selectedQuestion));
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

      //Update/save study info
      async updateStudy(newStudyInfo) {
        try {
          // if there's no id, it's a new study, save it as draft
          if (!newStudyInfo.id) {
            newStudyInfo.published = false;

            console.log('Submitting study:', JSON.stringify(newStudyInfo, null, 2));
            const response = await api.post('/studies', newStudyInfo);

            this.study = response.data.study;
            alert('study saved as draft');

          } else {
            const response = await api.patch(`/studies/${newStudyInfo.id}`, newStudyInfo);

            this.study = response.data.study;
            alert('study updated successfully');
          }
        } catch (error) {
          console.error('Error saving: ', error);
          alert('Save failed: ' + (error.response?.data?.message || error.message));
        }
      },
  
      // Update question data after any change within the question component
      updateQuestionData(updatedData) {
        console.log("Updated Data Received in Parent:", updatedData);
        Object.assign(this.selectedQuestion, updatedData); // maintains Vue reactivity
      }
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