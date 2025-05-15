<template>
  <div class="editor-panel">
    <StudyInfoEditor v-if="store.selectedQuestionIndex === null" />

    <div v-else>
      <div class="type-selector">
        <label>Question Type:</label>
        <select v-model="question.type">
          <option value="ranking">Ranking</option>
          <option value="slider">Slider</option>
          <option value="text">Text</option>
        </select>
      </div>
      <component
        :is="currentComponent"
        v-model="question"
        :key="store.selectedQuestionIndex"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStudyStore } from '@/store/studyStore';

import StudyInfoEditor from './StudyInfoEditor.vue';
import QuestionTypeRanking from './questions/QuestionTypeRanking.vue';
import QuestionTypeSlider from './questions/QuestionTypeSlider.vue';

const store = useStudyStore();

const question = computed({
  get: () => store.questions[store.selectedQuestionIndex],
  set: (val) => store.updateQuestion(store.selectedQuestionIndex, val),
});

const currentComponent = computed(() => {
  switch (question.value?.type) {
    case 'ranking':
      return QuestionTypeRanking;
    case 'slider':
      return QuestionTypeSlider;
    default:
      return QuestionTypeText;
  }
});
</script>

<style scoped>
.editor-panel {
  padding: 1rem;
}
.type-selector {
  margin-bottom: 1rem;
}
</style>
