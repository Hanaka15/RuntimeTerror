<script>
import { useAuthStore } from "../store/authStore";
import TopBar from "../components/TopBar.vue";
import SideBar from "../components/SideBar.vue";

// Import example subcomponents
import DashboardHome from "../components/DashboardHome.vue";
import ProfileSettings from "../components/ProfileSettings.vue";

export default {
  components: {
    TopBar,
    SideBar,
    DashboardHome,
    ProfileSettings,
  },
  data() {
    return {
      currentView: "DashboardHome",
    };
  },
  computed: {
    user() {
      const authStore = useAuthStore();
      return authStore.user;
    },
  },
  methods: {
    async logout() {
      const authStore = useAuthStore();
      await authStore.logout();
      this.$router.push("/login");
    },
    changeView(viewName) {
      this.currentView = viewName;
    },
  },
  mounted() {
    const authStore = useAuthStore();
    if (!authStore.user) {
      authStore.fetchUser();
    }
  },
};
</script>

<template>
  <div class="dashboard-container">
    <TopBar :user="user" />
    <SideBar :user="user" @change-view="changeView" />
    <div class="content">
      <div class="content-container">
        <component :is="currentView" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../style/style.scss";

.dashboard-container {
  display: grid;
  grid-template-columns: 20rem 1fr;
  grid-template-rows: auto 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px; 
  height: 100vh;
  width: 100vw;
}

.content {
  grid-area: 2 / 2 / 3 / 3;
  padding: 0 $gap $gap $gap;  
  &-container {
    background-color: $background-secondary;
    border-radius: .5rem;
    width: 100%;
    height: 100%;
  }
}
</style>