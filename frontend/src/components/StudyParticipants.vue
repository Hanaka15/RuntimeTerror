<template>
  <div class="participants-page">
    <div class="container">
      <!-- Banner Message -->
      <div v-if="bannerMessage" :class="['banner', bannerType]">
        {{ bannerMessage }}
        <button class="close-banner" @click="bannerMessage = ''">×</button>
      </div>

      <h2>Manage Study Participants</h2>

      <div class="email-input-container wide">
        <div class="email-tags">
          <span v-for="(email, index) in emails" :key="index" class="email-tag">
            {{ email }}
            <button class="remove-email" @click="removeEmail(index)">×</button>
          </span>
          <input type="email" v-model="currentEmail" @keydown.space.prevent="addEmail" @keydown.enter.prevent="addEmail"
            placeholder="Type email and press space or enter" class="email-input" />
        </div>
        <button class="submit-button" @click="submitEmails" :disabled="emails.length === 0">
          Submit
        </button>
      </div>

      <!-- Participants List -->
      <div class="participants-list" v-if="participants.length > 0">
        <h3>Participants</h3>
        <div
          class="participants-scroll"
          ref="scrollContainer"
          @scroll="handleScroll"
        >
          <div
            v-for="(participant, idx) in participants"
            :key="participant._id"
            class="participant-card"
          >
            <div class="left">
              <div class="index">{{ idx + 1 }}</div>
              <div class="avatar">
                <img
                  :src="`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${participant.email}`"
                  alt="avatar"
                />
              </div>
            </div>
            <div class="middle">
              <div class="email">{{ participant.email }}</div>
              <div class="answers">
                <span class="answers-count">
                  {{ participant.answers.length }} / {{ participant.totalQuestions }} answered
                </span>
                <span class="status" :class="'status-' + getStatus(participant)">
                  {{ getStatus(participant) }}
                </span>
              </div>
            </div>
            <div class="right">
              <button class="copy-link-btn" @click="copyParticipantLink(participant._id)">
                Copy Link
              </button>
              <button class="delete-btn" @click="deleteParticipant(participant._id)">Delete</button>
            </div>
          </div>
          <div v-if="loadingMore" class="loading-more">Loading more...</div>
          <div v-if="!hasMore && participants.length > 0" class="end-of-list">End of list</div>
        </div>
      </div>
      <div v-else class="no-participants">
        No participants yet.
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/axios';

const PAGE_SIZE = 20;

export default {
  name: 'StudyParticipants',
  data() {
    return {
      currentEmail: '',
      emails: [],
      studyId: this.$route.params.studyId,
      bannerMessage: '',
      bannerType: 'success',
      participants: [],
      page: 1,
      hasMore: true,
      loadingMore: false,
      participantLinkCopied: null, // store participantId if copied
    };
  },
  methods: {
    addEmail() {
      const email = this.currentEmail.trim();
      if (email && this.isValidEmail(email) && !this.emails.includes(email)) {
        this.emails.push(email);
      }
      this.currentEmail = '';
    },
    removeEmail(index) {
      this.emails.splice(index, 1);
    },
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    async submitEmails() {
      try {
        const submitEmails = await api.post(`/studies/${this.studyId}/participants`, {
          emails: this.emails,
          study_id: this.studyId
        });
        if (submitEmails.status !== 201) {
          throw new Error('Failed to submit emails');
        }
        this.currentEmail = '';
        this.emails = [];
        this.resetAndFetchParticipants();
      } catch (error) {
        console.error('Failed to submit emails:', error);
      }
    },
    async fetchParticipants(page = 1, append = false) {
      try {
        this.loadingMore = true;
        const response = await api.get(`/studies/${this.studyId}/participants`, {
          params: { page, limit: PAGE_SIZE }
        });
        const data = response.data;
        if (append) {
          this.participants = [...this.participants, ...data];
        } else {
          this.participants = data;
        }
        this.hasMore = data.length === PAGE_SIZE;
        this.loadingMore = false;
      } catch (error) {
        this.loadingMore = false;
        console.error('Failed to fetch participants:', error);
      }
    },
    resetAndFetchParticipants() {
      this.page = 1;
      this.hasMore = true;
      this.fetchParticipants(1, false);
    },
    getStatus(participant) {
      if (!participant.answers || participant.answers.length === 0) {
        return 'not_started';
      }
      if (participant.answers.length < participant.totalQuestions) {
        return 'in_progress';
      }
      return 'completed';
    },
    async deleteParticipant(participantId) {
      if (!confirm('Are you sure you want to delete this participant?')) return;
      try {
        await api.delete(`/studies/${this.studyId}/participants/${participantId}`);
        this.resetAndFetchParticipants();
        this.bannerMessage = 'Participant deleted successfully.';
        this.bannerType = 'success';
      } catch (error) {
        this.bannerMessage = 'Failed to delete participant.';
        this.bannerType = 'error';
        console.error('Failed to delete participant:', error);
      }
    },
    copyParticipantLink(participantId) {
      const url = `https://group2.sustainability.it.ntnu.no/participant/${participantId}`;
      navigator.clipboard.writeText(url).then(() => {
        this.participantLinkCopied = participantId;
        setTimeout(() => { this.participantLinkCopied = null; }, 1500);
      });
    },
    handleScroll() {
      const container = this.$refs.scrollContainer;
      if (!container || this.loadingMore || !this.hasMore) return;
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 50) {
        this.page += 1;
        this.fetchParticipants(this.page, true);
      }
    }
  },
  mounted() {
    this.resetAndFetchParticipants();
  }
}
</script>

<style lang="scss" scoped>
.participants-page {
  position: relative;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.email-input-container {
  margin: 2rem 0 1.5rem 0;
  background: var(--background-alt);
  padding: 1rem 2rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  &.wide {
    max-width: 100%;
    width: 100%;
  }
}

.email-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem 0;
  min-height: 3rem;
}

.email-tag {
  display: inline-flex;
  align-items: center;
  background: var(--selection);
  color: var(--text-bright);
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
}

.remove-email {
  background: none;
  border: none;
  color: var(--text-bright);
  margin-left: 0.5rem;
  cursor: pointer;
  padding: 0 0.25rem;
  font-size: 1.2rem;
  line-height: 1;

  &:hover {
    color: var(--text-muted);
  }
}

.email-input {
  flex: 1;
  min-width: 200px;
  border: none;
  background: none;
  color: var(--text-main);
  padding: 0.25rem;
  outline: none;
  box-shadow: none;
}

.submit-button {
  margin-top: 1rem;
  align-self: flex-end;
  padding: 0.5rem 1.25rem;
  background: var(--button-base);
  color: var(--text-bright);
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: var(--button-hover);
  }
}

.participants-list {
  margin-top: 2rem;
  width: 100%;
}

.participants-scroll {
  max-height: 480px;
  overflow-y: auto;
  background: var(--background-alt);
  border-radius: var(--border-radius);
  border: 1px solid var(--border);
  padding: 0.5rem 0;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
}

.participant-card {
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--border);
  transition: background 0.2s;
  &:hover {
    background: var(--background-muted);
  }
  .left {
    display: flex;
    align-items: center;
    margin-right: 1.5rem;
    .index {
      font-size: 1.2rem;
      font-weight: 600;
      margin-right: 1rem;
      color: var(--text-muted);
      width: 2rem;
      text-align: right;
    }
    .avatar img {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      object-fit: cover;
      background: #fff;
      border: 1px solid #eee;
    }
  }
  .middle {
    flex: 1;
    .email {
      font-size: 1.05rem;
      font-weight: 500;
      color: var(--text-main);
      margin-bottom: 0.25rem;
    }
    .answers {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      .answers-count {
        font-size: 0.95rem;
        color: var(--text-muted);
      }
      .status {
        font-size: 0.95rem;
        font-weight: 600;
        padding: 0.15rem 0.75rem;
        border-radius: 1rem;
        &.status-not_started {
          background: #fff1f0;
          color: #a8071a;
        }
        &.status-in_progress {
          background: #fffbe6;
          color: #d48806;
        }
        &.status-completed {
          background: #e6ffed;
          color: #237804;
        }
      }
    }
  }
  .right {
    margin-left: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    .copy-link-btn {
      padding: 0.35rem 1rem;
      cursor: pointer;
      font-size: 0.95rem;
      margin-bottom: 0.3rem;
      transition: background 0.13s;
    }

    .delete-btn {
      border: 1px solid #f36860;
      padding: 0.35rem 1rem;
      cursor: pointer;
      font-size: 0.95rem;
      margin-bottom: 0.3rem;
      transition: background 0.13s;
      &:hover {
        background: #ffa39e;
        color: #fff;
      }
    }
  }
}

.loading-more,
.end-of-list {
  text-align: center;
  color: var(--text-muted);
  padding: 0.75rem 0;
  font-size: 0.95rem;
}

.no-participants {
  margin-top: 2rem;
  color: var(--text-muted);
  text-align: center;
}

/* Banner styles */
.banner {
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  width: 100%;
  position: absolute;
  top: 2rem;
}
.banner.success {
  background: #e6ffed;
  color: #237804;
  border: 1px solid #b7eb8f;
}
.banner.error {
  background: #fff1f0;
  color: #a8071a;
  border: 1px solid #ffa39e;
}
.close-banner {
  background: none;
  border: none;
  color: inherit;
  font-size: 1.2rem;
  margin-left: auto;
  cursor: pointer;
  padding: 0 0.5rem;
}

/* Dot background */
.dot-plane {
  position: fixed;
  inset: 0;
  background: #161f27;
  overflow: hidden;
  z-index: -1;
  perspective: 800px;
  width: 100vw;
  height: 100vh;
}

.dot-grid {
  pointer-events: none;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 550vw;
  height: 550vh;
  z-index: -1;
  transform: translate(-50%, -50%) rotateX(65deg);
  background-image: radial-gradient(#ffffff 1px, transparent 1px);
  background-size: 30px 30px;
  animation: scrollGrid 30s linear infinite;
  opacity: 0.2;
  will-change: transform;
}

@keyframes scrollGrid {
  from {
    transform: translate(-50%, -50%) rotateX(50deg) rotateZ(40deg) translate(0);
  }

  to {
    transform: translate(-50%, -50%) rotateX(50deg) rotateZ(40deg) translate(-400px);
  }
}
</style>
