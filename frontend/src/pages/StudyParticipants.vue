<template>
  <div class="participants-page">
    <div class="dot-plane">
      <div class="dot-grid"></div>
    </div>

    <div class="container">
      <h2>Manage Study Participants</h2>
      
      <div class="email-input-container">
        <div class="email-tags">
          <span 
            v-for="(email, index) in emails" 
            :key="index" 
            class="email-tag"
          >
            {{ email }}
            <button class="remove-email" @click="removeEmail(index)">×</button>
          </span>
          <input
            type="email"
            v-model="currentEmail"
            @keydown.space.prevent="addEmail"
            @keydown.enter.prevent="addEmail"
            placeholder="Type email and press space or enter"
            class="email-input"
          />
        </div>
        <button 
          class="submit-button" 
          @click="submitEmails"
          :disabled="emails.length === 0"
        >
          Submit
        </button>
      </div>

      <div v-if="submittedEmails.length > 0" class="submitted-emails">
        <h3>Submitted Emails</h3>
        <ul>
          <li v-for="(email, index) in submittedEmails" :key="index">
            {{ email }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/axios';

export default {
  name: 'StudyParticipants',
  data() {
    return {
      currentEmail: '',
      emails: [],
      submittedEmails: [],
      studyId: this.$route.params.study_id
    };
  },
  methods: {
    addEmail() {
      if (this.currentEmail && this.isValidEmail(this.currentEmail)) {
        if (!this.emails.includes(this.currentEmail)) {
          this.emails.push(this.currentEmail);
        }
        this.currentEmail = '';
      }
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
        // Create sessions for each email
        const sessions = await Promise.all(
          this.emails.map(email => 
            api.post(`/sessions/${this.studyId}`, {
              demographics: { email }
            })
          )
        );

        // Store the submitted emails
        this.submittedEmails = [...this.submittedEmails, ...this.emails];
        this.emails = [];

        // Send participation links via email
        await api.post(`/studies/${this.studyId}/notify`, {
          sessions: sessions.map(s => s.data.sessionId)
        });

      } catch (error) {
        console.error('Failed to submit emails:', error);
        alert('Failed to submit emails. Please try again.');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.participants-page {
  min-height: 100vh;
  position: relative;
}

.container {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.email-input-container {
  margin: 2rem 0;
  background: var(--background-alt);
  padding: 1rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--border);
}

.email-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
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
}

.submit-button {
  margin-top: 1rem;
  float: right;
  padding: 0.5rem 1rem;
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

.submitted-emails {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
  background: var(--background-alt);
  padding: 1rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--border);

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    padding: 0.5rem;
    border-bottom: 1px solid var(--border);
    
    &:last-child {
      border-bottom: none;
    }
  }
}

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
