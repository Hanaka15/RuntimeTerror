<template>
    <div>
        <h3>Preference Question</h3>
        <label for="questionText">Question Text</label>
        <input
            id="questionText"
            v-model="questionData.question"
            placeholder="Enter Question Text"
            @input="emitQuestionChange"
        />

        <h4>Pairs</h4>
        <div v-for="(pair, index) in questionData.pairs" :key="index">
            <input v-model="pair.left" placeholder="Left Option" @input="emitQuestionChange"/>
            <input v-model="pair.right" placeholder="Right Option" @input="emitQuestionChange"/>
        </div>
        <button @click="addPair">Add to Pair</button>
    </div>
</template>

<script>
export default {
    props: {
        questionData: {
            type: Object,
            required: true,
            default: () => ({
                question: "",
                pairs: [],
            }),
        },
    },
    methods: {
        addPair() {
            if (!this.questionData.pairs) {
                this.questionData.pairs = [];
            }
            this.questionData.pairs.push({ left: "", right: ""});
            this.emitQuestionChange();
        },
        emitQuestionChange() {
            this.$emit("update", this.questionData);
        },
    }
};
</script>