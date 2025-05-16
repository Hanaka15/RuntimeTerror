<template>
  <aside class="sidebar">
    <h3>Study Builder</h3>
    <ul>
      <li
        :class="{ active: store.selectedQuestionIndex === null }"
        @click="store.setSelectedQuestion(null)"
      >
        Study Details
      </li>
      <li
        v-for="(q, index) in store.questions"
        :key="index"
        @click="store.setSelectedQuestion(index)"
        :class="{ active: store.selectedQuestionIndex === index }"
      >
        {{ q.type }} Question {{ index + 1 }}
      </li>
    </ul>
    <button @click="addNewQuestion">+ Add Question</button>
  </aside>
</template>

<script setup>
import { useStudyStore } from '@/store/studyStore';

const store = useStudyStore();

function addNewQuestion() {
  store.addQuestion({
    type: 'ranking',
    files: [],
    config: {}
  });
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  padding: 1rem;
  border-right: 1px solid #ccc;
}
.active {
  font-weight: bold;
}
</style>
