<template>
  <aside class="sidebar">
    <h3>Study Builder</h3>
    <div class="sidebar-list-container">
      <ul class="sidebar-list">
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
          <span class="question-type">{{ q.type.charAt(0).toUpperCase() + q.type.slice(1) }}</span>
          <span class="question-label">Question {{ index + 1 }}</span>
        </li>
      </ul>
    </div>
    <button class="add-question-btn" @click="addNewQuestion">+ Add Question</button>
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
  width: 300px;
  padding: 2rem 1.2rem 1.2rem 1.2rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 90vh;
  overflow: scroll;
  position: relative;
}

.sidebar h3 {
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  letter-spacing: 0.02em;
}

.sidebar-list-container {
  flex: 1 1 auto;
  overflow-y: auto;
  min-height: 0;
  margin-bottom: 1.5rem;
}

.sidebar-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar-list li {
  padding: 0.7rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  justify-content: space-between;
}

.sidebar-list li.active {
  font-weight: bold;
  background: var(--background-alt);
}

.sidebar-list li:hover:not(.active) {
  background: var(--background-alt);
}

.question-type {
  font-weight: 500;
  margin-right: 0.5rem;
}

.question-label {
  color: #666;
  font-size: 0.97em;
}

.add-question-btn {
  width: 100%;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  margin: 0;
}
</style>
