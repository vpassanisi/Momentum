<template>
  <div v-if="post !== null && sub !== null" class="flex justify-center mt-32">
    <div class="grid gap-6 grid-cols-1 md:grid-cols-3 w-90p max-w-screen-lg">
      <div
        class="md:col-span-2 p-4 rounded bg-white dark:bg-dark-gray-800 shadow border border-gray-400 dark:border-gray-700"
      >
        <div class="text-xl font-medium">{{ post.title }}</div>
        <div class>{{ post.body }}</div>
        <div class="border-b border-gray-400 dark:border-gray-700 my-4" />
        <Comment v-for="com in comments" :key="com._id" :comment="com" />
      </div>
      <About class="order-last" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import Comment from "@/components/Comment.vue";
import About from "@/components/About.vue";

export default Vue.extend({
  name: "Thread",
  components: {
    About,
    Comment,
  },
  computed: {
    ...mapState("PostState", ["post", "comments"]),
    ...mapState("SubState", ["sub", "posts"]),
  },
  methods: {
    ...mapActions("PostState", ["getPostById"]),
    ...mapActions("SubState", ["getSubByName"]),
  },
  mounted: function() {
    this.getPostById(this.$route.params.id);
    this.getSubByName(this.$route.params.sub);
  },
});
</script>
