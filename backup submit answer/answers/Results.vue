<template>
    <div class="results-page">
        <h2>Thank you for participating!</h2>
        <p>Your Answers have been submitted successfully</p>
        <p>You can safely close this window</p>
    </div>
</template>

<script>
    export default {
        name: "Results",
        methods: {
            closeTab() {
                window.close();
            }
        }
    };
</script>


<style lang="scss" scoped>
.results-page {
    text-align: center;
    padding: 2rem;
}

button {
    margin-top: 1rem;
}
</style>