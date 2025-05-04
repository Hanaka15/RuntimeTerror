
<script>
export default {
  data() {
    return {
      showDropdown: false,
    };
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  methods: {
    logout() {
      this.$emit('logout');
    },
  },
};
</script>


<template>
  <div class="topbar">
    <nav>
      <div class="right">
        <button class="notification">
          <font-awesome-icon :icon="['fas', 'bell']" />
        </button>
        <button class="user" @click="showDropdown = !showDropdown">
          <p>{{ user.username }}</p>
          <img
            :src="
              user.avatar
                ? user.avatar
                : `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${user.username}`
            "
            alt="avatar"
          />
        </button>
      </div>
    </nav>
    <div class="dropdown" :style="{ display: showDropdown ? 'block' : 'none' }">
      <div class="dropdown-content">
        <button @click="logout">Logout</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dropdown {
  background-color: var(--background-alt);
  border-radius: var(--border-radius);
  position: absolute;
  right: var(--gap);
  margin-top: 0.25rem;
  z-index: 999;
  padding: var(--gap);

  .dropdown-content {
    button {
      margin: 0;
    }
  }
}

.topbar {
  grid-area: 1 / 2 / 2 / 3;
  padding: var(--gap);

  nav {
    width: 100%;
    height: 100%;
    background-color: var(--background-alt);
    border-radius: 0.5rem;

    .right {
      float: right;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }

    .notification {
      margin: 0;
      padding: 1rem;
      background-color: transparent;
      cursor: pointer;
      &:active,
      &:focus {
        outline: none;
        border: none;
        box-shadow: none;
      }
    }

    .user {
      padding: 0.25rem 0.25rem 0.25rem 0.75rem;
      margin: var(--gap);
      text-align: center;

      p {
        display: inline-block;
      }

      img {
        vertical-align: middle;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 0.35rem;
        margin: 0 0 0 0.5rem;
      }
    }
  }
}
</style>