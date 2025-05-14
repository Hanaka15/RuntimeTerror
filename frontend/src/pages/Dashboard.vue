<script>
import { useAuthStore } from "../store/authStore";
import TopBar from "../components/TopBar.vue";
import SideBar from "../components/SideBar.vue";

import DashboardHome from "../components/DashboardHome.vue";
import ProfileSettings from "../components/ProfileSettings.vue";
import CreateStudy from "../components/CreateStudy.vue";

export default {
  components: {
    TopBar,
    SideBar,
    DashboardHome,
    ProfileSettings,
    CreateStudy,
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
    <TopBar :user="user"/>
    <SideBar :user="user" @change-view="changeView" />
    <div class="content">
      <div class="content-container">
        <component :is="currentView" @change-view="changeView" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-container {
  display: grid;
  grid-template-columns: 15rem auto;
  grid-template-rows: auto 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px; 
  height: 100vh;
  width: 100vw;
}

.content {
  grid-area: 2 / 2 / 3 / 3;
  padding: 0 var(--gap) var(--gap) var(--gap);  
  &-container {
    border-radius: .5rem;
    width: 100%;
    height: 100%;
  }
}
</style>