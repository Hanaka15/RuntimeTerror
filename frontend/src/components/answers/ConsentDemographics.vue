<template>
  <div class="consent-demographics">
    <h2>{{ study.name }}</h2>

    <div v-if="study.consent" class="consent-section">
      <p>{{ study.consent }}</p>
      <label>
        <input type="checkbox" v-model="consentGiven" />
        I agree to participate
      </label>
    </div>

    <div v-if="study.demographics" class="demographics-section">
      <label>Age:
        <select v-model="demographics.ageGroup">
          <option disabled value="">Select age group</option>
          <option>Under 18</option>
          <option>18–24</option>
          <option>25–34</option>
          <option>35–44</option>
          <option>45–54</option>
          <option>55–64</option>
          <option>65+</option>
        </select>
      </label>

      <label>
        Gender:
        <select v-model="demographics.gender">
          <option disabled value="">Select one</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
          <option>Prefer not to say</option>
        </select>
      </label>
    </div>

    <button
      :disabled="(study.consent && !consentGiven) || (study.demographics && (!demographics.ageGroup || !demographics.gender))"
      @click="startSession"
    >
      Start Survey
    </button>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "ConsentDemographics",
  props: {
    study: {
      type: Object,
      required: true
    },
    studyId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      consentGiven: false,
      demographics: {
        ageGroup: "",
        gender: ""
      }
    };
  },
  emits: ["session-started"],
  methods: {
    async startSession() {
      try {
        const res = await api.post(`/sessions/${this.studyId}`, {
          demographics: this.demographics
        });
        this.$emit("session-started", res.data.sessionId);
      } catch (err) {
        console.error("Failed to start session", err);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.consent-demographics {
  padding: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

}

.consent-section {
  padding: 2rem;
  label {
    margin: 50px 0;
  }
}

.demographics-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  select {
    margin-top: 20px;
  }
}

button {
  margin-top: 20px;
  width: 50%;
}
</style>
