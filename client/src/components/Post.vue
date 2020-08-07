<template>
  <router-link
    :to="{path: postData._id}"
    append
    class="block w-full bg-white dark:bg-dark-gray-800 p-4 mb-8 shadow border border-blue-gray-200 dark:border-blue-gray-600 rounded"
  >
    <div class="text-xl font-medium">{{postData.title}}</div>
    <div>{{postData.body}}</div>
  </router-link>
</template>

<script lang="ts">
import Vue from "vue";

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
    postData: Object as () => Post,
  },
  methods: {
    handleClick() {
      this.$router.push(`/${this.postData._id}`);
    },
  },
});
</script>