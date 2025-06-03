<template>
  <div class="file-uploader" @dragover.prevent @drop.prevent="handleDrop">
    <label class="upload-label">
      <input type="file" multiple @change="handleFileInput" hidden />
      <span>📁 Click or drag files here to upload</span>
    </label>

    <div class="file-preview" v-if="previewFiles.length">
      <div class="file-card" v-for="(file, index) in previewFiles" :key="file.id">
        <div class="preview">
          <img v-if="file.type.startsWith('image/')" :src="file.preview" alt="Image Preview" />
          <video v-else-if="file.type.startsWith('video/')" :src="file.preview" controls />
          <audio v-else-if="file.type.startsWith('audio/')" :src="file.preview" controls />
          <div v-else class="file-icon">📄</div>
        </div>
        <div class="file-info">
          <span class="filename">{{ file.name }}</span>
        </div>
        <button class="remove-btn" @click="removeFile(index)">Remove</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue']);

// Internal reactive preview list with URLs
const previewFiles = ref([]);

// Helper: generate unique IDs for keys
function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

// Cleanup old previews URLs to avoid memory leaks
function revokePreviews() {
  previewFiles.value.forEach(f => {
    if (f.preview) URL.revokeObjectURL(f.preview);
  });
  previewFiles.value = [];
}

// When modelValue changes, update previewFiles array properly
watch(() => props.modelValue, (newFiles) => {
  revokePreviews();

  previewFiles.value = (newFiles || []).map(file => {
    // If file is already a previewFile object, reuse id and preview
    if (file.preview && file.id) {
      return file;
    }
    return {
      id: generateId(),
      file,
      name: file.name,
      type: file.type,
      preview: URL.createObjectURL(file)
    };
  });
}, { immediate: true });

onBeforeUnmount(() => {
  revokePreviews();
});

function handleFileInput(event) {
  const inputFiles = Array.from(event.target.files);
  addFiles(inputFiles);
}

function handleDrop(event) {
  const droppedFiles = Array.from(event.dataTransfer.files);
  addFiles(droppedFiles);
}

function addFiles(newFiles) {
  // Add new files with preview URLs and unique IDs
  const newPreviewFiles = newFiles.map(file => ({
    id: generateId(),
    file,
    name: file.name,
    type: file.type,
    preview: URL.createObjectURL(file)
  }));

  previewFiles.value.push(...newPreviewFiles);

  // Emit only the raw files (without preview, id, etc)
  emit('update:modelValue', previewFiles.value.map(f => f.file));
}

function removeFile(index) {
  URL.revokeObjectURL(previewFiles.value[index].preview);
  previewFiles.value.splice(index, 1);
  emit('update:modelValue', previewFiles.value.map(f => f.file));
}
</script>

<style lang="scss" scoped>
.file-uploader {
  border: 2px dashed rgba(0, 0, 0, 0.527);
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
}

.upload-label {
  display: block;
  cursor: pointer;
  color: #555;
  font-weight: bold;

  input {
    margin: 0 auto;
    margin-bottom: 1rem;
  }
}

.file-preview {
  display: flex;
  flex-wrap: wrap;
  margin-top: 1rem;
  gap: 1rem;
}

.file-card {
  border-radius: 6px;
  padding: 0.5rem;
  text-align: center;
  position: relative;
}

.preview img,
.preview video {
  max-width: 100%;
  max-height: 150px;
  display: block;
  margin: 0 auto;
}

.preview audio {
  width: 100%;
}

.file-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  margin: 0.25rem 0 .5rem 0;
  position: relative;
}

.remove-btn {
  width: 100%;
  border: 1px solid #ff2121;
}

.filename {
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-icon {
  font-size: 2rem;
}
</style>
