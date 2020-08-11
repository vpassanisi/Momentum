<template>
  <div class="w-full">
    <div
      class="w-full bg-blue-900 p-3 text-white text-xl rounded-t border-l border-r border-t border-gray-400 dark:border-gray-700"
    >
      About Community
    </div>
    <div
      class="bg-white dark:bg-dark-gray-800 p-4 rounded-b border-l border-r border-b border-gray-400 dark:border-gray-700"
    >
      {{ sub.description }}
      <div class="border-b border-gray-400 dark:border-gray-700 my-4" />
      Created: {{ sub.createdAt }}
      <router-link
        v-if="isAuthenticated"
        class="flex text-white items-center justify-center mt-4 rounded p-2 w-full bg-blue-900"
        :to="{ path: `/s/${$route.params.sub}/create` }"
        >Create Post</router-link
      >
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";

export default Vue.extend({
  name: "About",
  computed: {
    ...mapState("SubState", ["sub", "posts"]),
    ...mapState("AuthState", ["isAuthenticated"]),
  },
});
</script>
