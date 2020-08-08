<template>
  <section class="flex justify-center pt-8">
    <div class="flex flex-row w-90p max-w-screen-lg">
      <div class="h-32 w-2/3 pr-4">
        <Post v-for="postData in posts" :key="postData._id" :postData="postData" />
      </div>
      <div class="h-32 w-1/3 pl-4">
        <About :description="sub.description" :createdAt="sub.createdAt" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import About from "./About.vue";
import Post from "./Post.vue";

export default Vue.extend({
  name: "Content",
  components: {
    About,
    Post,
  },
  computed: mapState("subState", ["sub", "posts"]),
});
</script>