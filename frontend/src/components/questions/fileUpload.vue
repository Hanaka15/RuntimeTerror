<template>
    <div>
      <input type="file" @change="handleFileChange" :accept="allowedTypes" multiple />
  
     <!-- Preview uploaded files -->
    <div v-if="questionData.files && questionData.files.length" class="file-list">
      <div v-for="(file, idx) in questionData.files" :key="file.url || file.name" class="file-block">
        <div v-if="isImage(file)">
          <img :src="file.url" style="max-width: 200px; margin: 10px 0;" />
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
  </div>
</template>
<script>
import api from "@/api/axios";
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
   async handleFileChange(event) {
    const files = Array.from(event.target.files);
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        // Upload to backend
        const response = await api.post('/upload/single', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        // Build the public URL for the uploaded file
        const fileUrl = `http://localhost:3000/uploads/${response.data.file.filename}`;

        // Add to questionData.files
        if (!this.questionData.files) this.questionData.files = [];
        this.questionData.files.push({
          url: fileUrl,
          name: file.name,
          description: '',
          isCorrect: false
        });
        // LOG FOR DEBUGGING
        console.log("questionData.files after upload:", this.questionData.files);
      } catch (err) {
        alert('File upload failed: ' + (err.response?.data?.message || err.message));
      }
    }
    this.$emit('update', this.questionData);
    event.target.value = '';
  },
  removeFile(idx) {
    this.questionData.files.splice(idx, 1);
    this.$emit('update', this.questionData);
  },
  isImage(file) {
    return /\.(jpg|jpeg|png)$/i.test(file.name || file.url);
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
