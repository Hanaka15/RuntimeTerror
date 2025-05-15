<template>
  <div class="profile-settings">
    <h1>Profile Information</h1>
    <div v-if="user">
      <img class="avatar" :src="user.avatar" alt="User Avatar">
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Username:</strong> {{ user.username }}</p>
    </div>
    <div v-else>
      <p>Loading user information...</p>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/store/authStore";

export default {
  name: "ProfileSettings",
  computed: {
    user() {
      const authStore = useAuthStore();
      return authStore.user;
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
</style>