<template>
    <div>
      <input type="file" @change="handleFileChange" :accept="allowedTypes" multiple />
  
      <div v-if="questionData.files && questionData.files.length" class="file-list">
        <div v-for="(file, idx) in questionData.files" :key="file.name" class="file-block">
          <div v-if="isImage(file)">
            <img :src="file.preview" style="max-width: 200px; margin: 10px 0;" />
          </div>
          <div v-else>
            <span>{{ file.name }}</span>
          </div>
          <input v-model="file.description" placeholder="File description" />
          <label>
            <input type="checkbox" v-model="file.isCorrect" />
            Mark as correct answer
          </label>
          <button @click="removeFile(idx)">Remove</button>
        </div>
      </div>
      <div v-if="questionData.files && questionData.files.length < 2" style="color: red;">
        Please upload at least 2 files.
      </div>
    </div>
  </template>

<script>
export default {
  props: {
    questionData: { type: Object, required: true }
  },
  data() {
    return {
      allowedTypes: '.jpg,.jpeg,.png,.pdf,.doc,.docx'
    }
  },
  methods: {
    handleFileChange(event) {
  const files = Array.from(event.target.files);
  const newFiles = files.map(file => ({
    file,
    name: file.name,
    preview: /\.(jpg|jpeg|png)$/i.test(file.name) ? URL.createObjectURL(file) : null,
    description: '',
    isCorrect: false
  }));
  if (!this.questionData.files) this.questionData.files = [];
  this.questionData.files = [...this.questionData.files, ...newFiles];



  this.$emit('update', this.questionData);
  event.target.value = '';
},
    removeFile(idx) {
      const file = this.questionData.files[idx];
      if (file.preview) URL.revokeObjectURL(file.preview);
      this.questionData.files.splice(idx, 1);
      this.questionData.files = [...this.questionData.files];
      this.$emit('update', this.questionData);
    },
    isImage(file) {
      return /\.(jpg|jpeg|png)$/i.test(file.name);
    }
  }
}
</script>

<style scoped>
.file-block {
  flex: 1 0 200px;
  max-width: 220px;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}

.file-list {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.file-block input[placeholder="File description"] {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 8px;
}
</style>
