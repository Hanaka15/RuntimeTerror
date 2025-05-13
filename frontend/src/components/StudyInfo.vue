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
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['study'],
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
        this.$emit('publish-study', this.study);
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
  </style>
  