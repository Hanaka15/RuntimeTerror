<template>
    <div class="sidebar">
      <div class="sidebar-content">
        <div class="sidebar-title">
          <img class="logo" src="../assets/logo.svg" alt="">
        </div>
        <ul class="nav-list">
          <li @click="$emit('change-view', 'DashboardHome')"><font-awesome-icon :icon="['fas', 'home']" /> Home</li>
          <li @click="$emit('change-view', 'ProfileSettings')"><font-awesome-icon :icon="['fas', 'user']" /> Profile</li>
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
  @import '../style/style.scss';
  
  .logo {
    width: 80%;
    margin: 1rem 0 1.5rem 0;
  }

  .sidebar {
    grid-area: 1 / 1 / 3 / 2;
    padding: $gap 0 $gap $gap;
  
    &-title {
      text-align: center;
    }
    &-content {
      background-color: $background-secondary;
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
  
      li {
        cursor: pointer;
        padding: 0.75rem 1rem;
        border-radius: 0.25rem;
        transition: background-color 0.2s ease;
  
        &:hover {
          background-color: #ffffff25;
          transform: scale(1.025);
        }
      }
    }
  }
  </style>
  