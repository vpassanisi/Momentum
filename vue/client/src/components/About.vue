<template>
  <div v-if="sub" class="w-full">
    <div
      class="w-full bg-primary p-3 text-white text-xl rounded-t border-l border-r border-t border-gray-400 dark:border-gray-700"
    >
      About Community
    </div>
    <div
      class="bg-white dark:bg-dark-gray-800 p-4 rounded-b border-l border-r border-b border-gray-400 dark:border-gray-700"
    >
      {{ sub.description }}
      <div class="border-b border-gray-400 dark:border-gray-700 my-4" />
      Created: {{ formatedTime }} ago
      <router-link
        v-if="isAuthenticated && $route.name !== 'Create Post'"
        class="flex text-white items-center justify-center mt-4 rounded p-2 w-full bg-primary-dark"
        :to="{ path: `/s/${$route.params.sub}/create` }"
        >Create Post</router-link
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Sub } from "@/store/modules/types";
import { defineComponent } from "vue";

export default defineComponent({
  name: "About",
  data: function() {
    return {
      formatedTime: "",
    };
  },
  computed: {
    sub(): Sub | undefined {
      return this.$store.direct.state.DataMod.subs[0];
    },
    isAuthenticated(): boolean {
      return this.$store.direct.state.AuthMod.isAuthenticated;
    },
  },
  async mounted() {
    if (this.sub) {
      this.formatedTime = await this.$store.direct.dispatch.getTimeSince(
        this.sub.createdAt
      );
    }
  },
});
</script>
