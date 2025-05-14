<template>
    <div class="sidebar">
      <div class="sidebar-content">
        <div class="sidebar-title">
          <img class="logo" src="../assets/logo.svg" alt="">
        </div>
        <ul class="nav-list">
          <router-link class="nav-link" to="/dashboard"><font-awesome-icon :icon="['fas', 'home']" /> Home</router-link>
          <router-link class="nav-link" to="/dashboard/settings"><font-awesome-icon :icon="['fas', 'user']" /> Profile</router-link>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['user']
  };
  </script>
  
  <style lang="scss" scoped>
  .logo {
    width: 80%;
    margin: 1rem 0 1.5rem 0;
  }

  .sidebar {
    grid-area: 1 / 1 / 3 / 2;
    padding: var(--gap) 0 var(--gap) var(--gap);
  
    &-title {
      text-align: center;
    }
    &-content {
      background-color: var(--background-alt);
      border-radius: 0.5rem;
      width: 100%;
      height: 100%;
      padding: .5rem;
    }
  
    .nav-list {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.125;
  
      .nav-link {
        cursor: pointer;
        padding: 0.75rem 1rem;
        border-radius: 0.25rem;
        color: var(--text-main);
        transition: background-color 0.2s ease;
  
        &:hover {
          background-color: #ffffff25;
          transform: scale(1.025);
          text-decoration: none;
        }
      }
    }
  }
  </style>
  