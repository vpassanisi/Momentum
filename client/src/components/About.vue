<template>
  <div class="w-full shadow">
    <div
      class="w-full bg-blue-900 p-3 text-white text-xl rounded-t border-l border-r border-t border-gray-400 dark:border-gray-700"
    >About Community</div>
    <div
      class="bg-white dark:bg-dark-gray-800 p-4 rounded-b border-l border-r border-b border-gray-400 dark:border-gray-700"
    >
      {{description}}
      <div class="border-b border-gray-400 dark:border-gray-700 my-4" />
      Created: {{createdAt}}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "About",
  props: {
    description: String,
    createdAt: Number,
  },
});
</script>