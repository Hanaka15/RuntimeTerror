<template>
  <div class="dashboard-home" data-test="dashboard-home">
    <div>
    </div>
    <div class="container">
      <h2>Surveys</h2>
      <div class="empty" v-if="!studies.length">You don't have any studies</div>
      <table v-else class="study-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Responses</th>
            <th>Researchers</th>
            <th>Actions</th>
            <!--<th>Status</th>-->
          </tr>
        </thead>
        <tbody>
          <tr v-for="(study, index) in studies" :key="study.id">
            <td>{{ index + 1 }}</td>
            <td class="title">{{ study.title }}</td>
            <td>{{ study.responses || 0 }}/{{ study.total || 0 }}</td>
            <td>
              <div class="researchers">
                <img
                v-for="n in 3"
                  :key="n"
                  :src="`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${Math.random().toString(36).substring(7)}`"
                />
              </div>
            </td>
            <td>
              <div class="action-buttons">
                <button class="action" @click="navigateToParticipants(study._id)">
                  Action
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <router-link class="nav-link" to="/dashboard/create">
  <button class="create-study">
    <font-awesome-icon :icon="['fas', 'plus']" />
  </button>
  </router-link>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "DashboardHome",
  data() {
    return {
      studies: [],
    };
  },
  async mounted() {
    try {
      const response = await api.get("/studies");
      this.studies = response.data;
    } catch (error) {
      console.error("Failed to fetch studies:", error);
    }
  },
  methods: {
    
    navigateToParticipants(studyId) {
      this.$router.push(`/dashboard/participants/${studyId}`);
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding: 1rem;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
}

.empty {
  text-align: center;
  margin-top: 1rem;
  font-size: 1rem;
}

.study-table {
  table-layout: auto;
  width: 100%;
  margin-top: 1rem;
  border-collapse: collapse;
  background-color: var(--background-alt);
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

  th,
  td {  
    text-align: center;
    vertical-align: middle;
  }

  thead {
    background-color: var(--background-alt);
    border-bottom: 1px solid var(--border-color);
  }

  tbody tr {
    border-bottom: 1px solid var(--border-color);

    &:hover {
      background-color: var(--background-muted);
    }
  }

  .title {
    text-transform: capitalize;
    font-size: 1.1rem;
  }

  .edit {
    padding: 0.5rem 1rem;
    cursor: pointer;
  }

  .researchers {
    width: fit-content;
    margin: 0 auto;
    padding: 0 0 0 1rem;
    img {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      margin-left: -1rem;
      object-fit: cover;
      transition: transform 0.2s, filter 0.2s;
      z-index: 2;
    }
  }
}

.create-study {
  background-color: var(--button-base);
  font-size: 2rem;
  line-height: 2rem;
  padding: 1rem 1.125rem;
  text-align: center;
  border: none;
  border-radius: 50%;
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  cursor: pointer;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.action {
  padding: 0.5rem 1rem;
  background: var(--button-base);
  color: var(--text-bright);
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;

  &:hover {
    background: var(--button-hover);
  }
}
</style>
