<template>
  <div class="profile-settings">
    <h1>Profile Information</h1>

    <div v-if="user">
      <img class="avatar" :src="user.avatar" alt="User Avatar" />
      <p><strong>Email:</strong> {{ user.email }}</p>

      <div class="username-row">
        <template v-if="editing">
          <input v-model="form.username" class="username-input" />
          <button @click="saveUsername">Save</button>
          <button @click="cancelEdit">Cancel</button>
        </template>
        <template v-else>
          <p class="username-display"><strong>Username:</strong> {{ user.username }}</p>
        </template>
      </div>
      <div v-if="!editing" class="edit-btn-row">
        <button @click="startEdit">Edit Username</button>
      </div>
    </div>

    <div v-else>
      <p>Loading user information...</p>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/store/authStore";
import api from "@/api/axios";

export default {
  name: "ProfileSettings",
  data() {
    return {
      editing: false,
      form: {
        username: "",
      },
    };
  },
  computed: {
    user() {
      return useAuthStore().user;
    },
  },
  methods: {
    startEdit() {
      this.editing = true;
      this.form.username = this.user.username;
    },
    cancelEdit() {
      this.editing = false;
      this.form.username = this.user.username;
    },
    async saveUsername() {
      try {
        const response = await api.patch("/auth/me", {
          username: this.form.username,
        });

        const authStore = useAuthStore();
        authStore.setUser(response.data.researcher);

        this.editing = false;
        alert("Username updated!");
      } catch (error) {
        console.error(error);
        alert("Failed to update username.");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 20px;
}
.profile-settings {
  padding: 20px;
  text-align: center;
}
p {
  font-size: 1.5rem;
  margin: 10px 0;
}
.username-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 10px;
}
.username-input {
  font-size: 1.2rem;
  padding: 5px;
  margin-bottom: 0;
  min-width: 180px;
}
.username-display {
  margin-bottom: 0;
}
.edit-btn-row {
  margin-top: 0.5rem;
  display: flex;
  justify-content: center;
}
button {
  margin: 0 5px;
}
</style>