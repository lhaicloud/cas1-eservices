<template>
    <div>
        {{ application }}
    </div>
</template>
<script>
    import { mapState } from 'vuex';

    export default {
        name: "ViewExistingApplicationDetails",
        computed: {
            ...mapState({
                application: state => state.application,
            }),
        },
        mounted() {
            console.log(this.application);
        },
    }
</script>