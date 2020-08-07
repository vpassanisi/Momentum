<template>
  <div class="flex items-center justify-center bg-white dark:bg-dark-gray-800 shadow">
    <div class="max-w-screen-lg w-90p text-4xl font-medium p-4">/s/{{ name }}</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Header",
  props: {
    name: String,
  },
});
</script>
