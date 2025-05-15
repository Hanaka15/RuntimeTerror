<template>
  <div>
    <input
      type="file"
      @change="handleFileChange"
      :accept="accept"
      :multiple="multiple"
    />

    <div v-if="files.length" class="file-list">
      <div v-for="(file, idx) in files" :key="file.name" class="file-block">
        <div v-if="isImage(file)">
          <img :src="file.preview" style="max-width: 200px; margin: 10px 0" />
        </div>
        <div v-else>
          <span>{{ file.name }}</span>
        </div>

        <input v-model="file.description" placeholder="File description" />

        <label v-if="allowCorrect">
          <input type="checkbox" v-model="file.isCorrect" />
          Mark as correct
        </label>

        <button @click="removeFile(idx)">Remove</button>
      </div>
    </div>

    <div v-if="required && files.length < minFiles" style="color: red">
      Please upload at least {{ minFiles }} files.
    </div>
  </div>
</template>

<script>
import axios from "@/api/axios";
export default {
  name: "FileUpload",
  props: {
    modelValue: { type: Array, default: () => [] },
    accept: { type: String, default: ".jpg,.jpeg,.png,.pdf,.doc,.docx" },
    multiple: { type: Boolean, default: true },
    required: { type: Boolean, default: false },
    minFiles: { type: Number, default: 2 },
    allowCorrect: { type: Boolean, default: true },
  },
  data() {
    return {
      files: this.modelValue || [],
    };
  },
  watch: {
    files: {
      handler() {
        this.$emit("update:modelValue", this.files);
      },
      deep: true,
    },
  },
  methods: {
    async handleFileChange(event) {
      const incoming = Array.from(event.target.files);
      const formData = new FormData();

      incoming.forEach((file) => {
        formData.append("files", file);
      });

      try {
        const res = await axios.post("/uploads/multiple", formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });

        const uploaded = res.data.files.map((file) => ({
          name: file.filename,
          path: file.path,
          description: "",
          isCorrect: false,
        }));

        this.files.push(...uploaded);
        this.$emit("update:modelValue", this.files);
        event.target.value = "";
      } catch (err) {
        console.error("Upload failed", err);
        alert("Upload failed: " + (err.response?.data?.message || err.message));
      }
    },
    removeFile(idx) {
      const file = this.files[idx];
      if (file.preview) URL.revokeObjectURL(file.preview);
      this.files.splice(idx, 1);
    },
  },
};
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
