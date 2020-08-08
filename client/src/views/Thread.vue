<template>
  <div v-if="post !== null && sub !== null" class="flex justify-center mt-32">
    <div class="flex flex-row justify-center w-90p max-w-screen-lg">
      <div
        class="w-2/3 mr-4 p-4 rounded bg-white dark:bg-dark-gray-800 shadow border border-gray-400 dark:border-gray-700"
      >
        <div class="text-xl font-medium">{{post.title}}</div>
        <div class>{{post.body}}</div>
        <div class="border-b border-gray-400 dark:border-gray-700 my-4" />
        <Comment v-for="com in comments" :key="com._id" :comment="com" />
      </div>
      <div class="w-1/3 ml-4">
        <About :description="sub.description" :createdAt="sub.createdAt" />
      </div>
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
    ...mapState("postState", ["post", "comments"]),
    ...mapState("subState", ["sub", "posts"]),
  },
  methods: {
    ...mapActions("postState", ["getPost"]),
    ...mapActions("subState", ["getSubByName"]),
  },
  mounted: function () {
    this.getPost(this.$route.params.id);
    this.getSubByName(this.$route.params.sub);
  },
});
</script>