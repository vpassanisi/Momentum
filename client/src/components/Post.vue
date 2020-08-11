<template>
  <router-link
    :to="{ path: `comments/${postData._id}` }"
    append
    class="block w-full bg-white dark:bg-dark-gray-800 p-4 mb-8 shadow border border-gray-400 dark:border-gray-700 rounded"
    :class="[isDarkMode ? 'hover:border-gray-400' : 'hover:border-gray-700']"
  >
    <div class="text-xl font-medium">{{ postData.title }}</div>
    <div>{{ postData.body }}</div>
  </router-link>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { mapState } from "vuex";

interface Post {
  _id: string;
  title: string;
  body: string;
  user: string;
  sub: string;
  createdAt: number;
}

export default Vue.extend({
  name: "Post",
  props: {
    postData: Object as PropType<Post>,
  },
  computed: mapState("DarkMode", ["isDarkMode"]),
  methods: {
    handleClick() {
      this.$router.push(`/${this.postData._id}`);
    },
  },
});
</script>
