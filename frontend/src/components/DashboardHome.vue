<template>
  <div class="dashboard-home">
    <div class="container">
      <h2>Surveys</h2>
      <ul>
        <li v-for="study in studies" :key="study.id">
          <div class="left">
            <div class="title">{{ study.title }}</div>
            <div class="responses">{{ study.responses }}/{{ study.total }}</div>
          </div>
          <div class="right">
            <div class="researchers">
              <img
                v-for="n in 3"
                :key="n"
                :src="`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${Math.random()
                  .toString(36)
                  .substring(7)}`"
              />
            </div>
            <div>
              <button>
                <font-awesome-icon :icon="['fas', 'pen-to-square']" />
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardHome",
  data() {
    return {
      studies: [],
    };
  },
  async mounted() {
    try {
      const response = await fetch("http://localhost:3000/studies", {
        credentials: 'include',
      });
      const data = await response.json();
      this.studies = data;
    } catch (error) {
      console.error("Failed to fetch studies:", error);
    }
  },
};
</script>

<style lang="scss" scoped>
@import "../style/style.scss";

.container {
  padding: 1rem;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
}

ul {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0 0;
  width: 100%;
}

li {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 0.5rem 0;
  padding: 0.5rem 1rem;
  background-color: $background-secondary;
  border-radius: 0.5rem;

  & > * {
    display: inline-block;
  }

  .title {
    font-size: 1.125rem;
  }

  .right {
    display: flex;
    align-items: center;

    .researchers {
      background-color: #ffffff1d;
      padding: 0.25rem 0.25rem 0.25rem 1.5rem;
      border-radius: 3.25rem;
      img {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        vertical-align: middle;
        margin-left: -1.25rem;
      }
    }
  }

  .left {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    gap: 1rem;
    .responses {
      font-size: 0.75rem;
      font-weight: 600;
      color: $primary;
    }
  }

  button {
    background-color: #646cff;
    border: none;
    color: #fff;
    min-height: 2.5rem;
    min-width: 2.5rem;
    font-size: 1.25rem;
    border-radius: 0.25rem;
    cursor: pointer;
    margin: 0 0 0 0.5rem;
    outline: none;
    border: 0;
    &:hover {
      background-color: #535bf2;
    }
  }
}
</style>
