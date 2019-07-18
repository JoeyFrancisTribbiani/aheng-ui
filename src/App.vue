<template>
    <div id="app">
        <div id="nav">
            <uploader action="http://localhost"></uploader>
            <alert>jkljkl</alert>
        </div>
        <!-- <router-view /> -->
    </div>
</template>

<script>
import Uploader from "../packages/upload";
import Alert from "../packages/alert";
export default {
    name: "app",
    components: {
        Uploader,
        Alert
    }
};
</script>


<style lang="scss">
// @import "../packages/theme-chalk/src/index.scss";
@import "../packages/theme-chalk/src/upload.scss";
@import "../packages/theme-chalk/src/alert.scss";
</style>
