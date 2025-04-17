<template>
    <div class="sidebar">
      <div class="sidebar-content">
        <ul class="nav-list">
          <li @click="$emit('change-view', 'DashboardHome')">🏠 Home</li>
          <li @click="$emit('change-view', 'ProfileSettings')">👤 Profile</li>
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
  
  .sidebar {
    grid-area: 1 / 1 / 3 / 2;
    padding: $gap 0 $gap $gap;
  
    &-content {
      background-color: $background-secondary;
      border-radius: 0.5rem;
      width: 100%;
      height: 100%;
      padding: 1rem;
    }
  
    .nav-list {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 1rem;
  
      li {
        cursor: pointer;
        padding: 0.75rem 1rem;
        border-radius: 0.25rem;
        transition: background-color 0.2s ease;
  
        &:hover {
          background-color: #ffffff25;
        }
      }
    }
  }
  </style>
  