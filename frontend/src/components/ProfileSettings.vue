<template>
  <div class="profile-settings">
    <h1>Profile Information</h1>

    <div v-if="user">
      <img class="avatar" :src="user.avatar" alt="User Avatar" />
      <p><strong>Email:</strong> {{ user.email }}</p>

      <div v-if="editing">
        <input v-model="form.username" />
        <button @click="saveUsername">Save</button>
        <button @click="cancelEdit">Cancel</button>
      </div>
      <div v-else>
        <p><strong>Username:</strong> {{ user.username }}</p>
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
import api from "@/api/axios"; // Make sure this is set up to point to your backend

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

        // Update user in store
        const authStore = useAuthStore();
        authStore.setUser(response.data.researcher); // Assuming your PATCH route returns updated researcher

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
input {
  font-size: 1.2rem;
  padding: 5px;
  margin-bottom: 10px;
}
button {
  margin: 0 5px;
}
</style>