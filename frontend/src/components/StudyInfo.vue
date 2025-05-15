<template>
    <div>
      <h3>Study Information</h3>
      
      <label for="studyName">Study Name</label>
      <input id="studyName" v-model="study.name" placeholder="Enter Study Name" />
      
      <label for="consent">Consent Form</label>
      <textarea id="consent" v-model="study.consent" placeholder="Enter consent form text"></textarea>
      
      <h3>Demographics</h3>
      <div v-for="(demographic, index) in study.demographics" :key="index">
        <input v-model="demographic.field" placeholder="Enter Demographic Field" />
        <select v-model="demographic.type">
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="date">Date</option>
        </select>
      </div>
      <button @click="addDemographic">Add Demographic Field</button>
      
      <div class="save-or-publish">
        <button @click="updateStudyInfo">Save Study Info</button>
        <button @click="publishStudy">Publish study</button>
        <button @click="addQuestion">Add Question</button>
      </div>

      <!-- Study Link Section -->
      <div v-if="study.id && study.published" class="study-link">
        <h3>Study Link</h3>
        <div class="link-container">
          <input 
            type="text" 
            :value="studyLink" 
            readonly 
            class="link-input"
          />
          <button @click="copyLink" class="copy-button">
            Copy Link
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['study'],
    computed: {
      studyLink() {
        if (!this.study.id) return '';
        return `${window.location.origin}/session/${this.study.id}`;
      }
    },
    methods: {
      addDemographic() {
        this.study.demographics.push({ field: '', type: 'text' });
      },
      updateStudyInfo() {
        if (this.study.questions.length > 0) {     
          this.$emit('update-study', this.study);
        }
      },
      publishStudy() {
        // Set published to true and emit update-study only
        this.study.published = true;
        this.$emit('update-study', this.study);
        // Do NOT emit 'publish-study' here!
      },
      
      addQuestion() {
        this.$emit('add-question');
      },
      copyLink() {
        navigator.clipboard.writeText(this.studyLink)
          .then(() => alert('Link copied to clipboard!'))
          .catch(err => console.error('Failed to copy link:', err));
      }
    }
  };
  </script>
  
  <style lang="scss" scoped>
  select, input, textarea {
    margin-bottom: 10px;
    padding: 5px;
    width: 100%;
    background-color: var(--background-alt);
  }

  .study-link {
    margin-top: 20px;
    padding: 15px;
    background-color: var(--background-alt);
    border-radius: 4px;
  }

  .link-container {
    display: flex;
    gap: 10px;
    margin-top: 10px;
  }

  .link-input {
    flex: 1;
    padding: 8px;
    background-color: var(--background);
    border: 1px solid var(--border);
    border-radius: 4px;
    font-family: monospace;
  }

  .copy-button {
    padding: 8px 16px;
    background-color: var(--button-base);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      background-color: var(--button-hover);
    }
  }

  .save-or-publish {
    margin-top: 20px;
    display: flex;
    gap: 10px;
    
    button {
      flex: 1;
    }
  }
  </style>
  