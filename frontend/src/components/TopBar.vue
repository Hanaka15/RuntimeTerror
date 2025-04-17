<template>
    <div class="topbar">
      <nav>
        <div class="user">
          <p>{{ user.username }}</p>
          <img :src="user.avatar ? user.avatar : `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${user.username}`" alt="avatar">
        </div>
      </nav>
    </div>
</template>

<style lang="scss" scoped>
@import '../style/style.scss';

.topbar {
    grid-area: 1 / 2 / 2 / 3;
    padding: $gap;

  nav {
    width: 100%;
    height: 100%;
    background-color: $background-secondary;
    border-radius: .5rem;
    
    .user {
      padding: .25rem .25rem .25rem .75rem;
      margin: $gap;
      text-align: center;
      float: right;
      
      p {
        display: inline-block;
        text-transform: capitalize;
      }

      img {
        vertical-align: middle;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: .35rem;
        margin: 0 0 0 .5rem;
      }
    }
  };
}

</style>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>

