<script setup>
import { onMounted } from "vue";

import Editor from "./components/Editor.vue";
import { inject } from "@vercel/analytics";

onMounted(inject);
</script>

<template>
  <Editor />
</template>

<style>
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
#app {
  height: 100vh;
}
</style>
