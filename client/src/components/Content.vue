<template>
  <section class="flex justify-center pt-8">
    <div class="grid gap-6 grid-cols-1 md:grid-cols-3 w-90p max-w-screen-lg">
      <div class="md:col-span-2">
        <Post
          v-for="postData in posts"
          :key="postData._id"
          :postData="postData"
        />
      </div>
      <About class="order-first md:order-last" />
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
  computed: mapState("SubState", ["sub", "posts"]),
});
</script>
