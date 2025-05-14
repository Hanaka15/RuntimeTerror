<template>
  <div class="rank-answer">
    <h3>{{ question.question }}</h3>

    <!-- Ranking list -->
    <div class="rank-target">
      <p v-if="ranked.length === 0" class="placeholder" style="opacity: 0.6; text-align: center;">Drag items here to rank them</p>

      <draggable
        :list="ranked"
        group="ranking"
        item-key="item => item"
        @change="emitAnswer"
      >
        <template #item="{ element, index }">
          <div class="rank-item">
            <span class="rank-number">{{ index + 1 }}.</span>
            <span>{{ element }}</span>
          </div>
        </template>
      </draggable>
    </div>

    <!-- unranked items -->
    <draggable
      class="rank-source"
      :list="available"
      group="ranking"
      item-key="item => item"
      @change="emitAnswer"
    >
      <template #item="{ element }">
        <div class="rank-item">{{ element }}</div>
      </template>
    </draggable>
  </div>
</template>


<script>
import draggable from "vuedraggable";

export default {
  name: "RankAnswer",
  components: { draggable },
  props: {
    question: {
      type: Object,
      required: true,
    },
    modelValue: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      ranked: [],
      available: [],
    };
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(newVal) {
        const allItems = this.question.items || [];

        //ranked items
        this.ranked = Array.isArray(newVal) ? [...newVal] : [];

        //unranked items
        this.available = allItems.filter(item => !this.ranked.includes(item));
      },
    },
  },
  methods: {
    emitAnswer() {
      this.$emit("update:modelValue", this.ranked);
    },
  },
};
</script>


<style scoped lang="scss">
.rank-answer {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
  width: 100%;
  margin: 0 auto;
  max-width: 800px;
}

.rank-target,
.rank-source {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border: 1px solid var(--border);
  background-color: var(--background-alt);
  margin-bottom: 1.5rem;

}

.rank-source {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.rank-item {
  padding: 0.5rem 1rem;
  border: 1px solid white;
  border-radius: 6px;
  cursor: grab;
  user-select: none;
  transition: all 0.2s;
  margin: 5px;
  width: 100%;
  &:hover {
    background-color: #fff;
    color: black;
    *{
      color:black;
    }
  }
}

.rank-number {
  font-weight: bold;
  margin-right: 0.5rem;
}
@media screen and (max-width: 1250px) {
  .rank-answer {
    width: 70%;
  }

  .rank-source {
    border: none;
  }
}

@media screen and (max-width: 800px) {
  .rank-answer {
    width: 100%;
  }

  .rank-source {
    flex-direction:column;
    border: none;
    background-color: transparent;
    width: 100%;
  }
}


</style>
