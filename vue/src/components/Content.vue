<template>
  <section class="flex justify-center pt-8">
    <div class="grid gap-6 grid-cols-1 md:grid-cols-3 w-90p max-w-screen-lg">
      <div class="md:col-span-2">
        <div
          class="flex flex-row w-full h-20 bg-white dark:bg-dark-gray-800 rounded border border-gray-400 dark:border-gray-700 mb-4 p-4"
        >
          <button
            class="flex flex-row items-center justify-center h-full p-2 focus:outline-none rounded-full mr-4"
            :class="[
              sort === 'createdAt' ? 'bg-gray-200 dark:bg-dark-gray-700' : '',
            ]"
            @click="sort = 'createdAt'"
          >
            <svg
              class="fill-current inline h-full w-8 mr-2"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <polygon
                  points="17.16 10 19.07 12.936 15.799 14.188 15.619 17.686 12.237 16.776 10.035 19.5 7.833 16.776 4.451 17.686 4.271 14.188 1 12.936 2.91 10 1 7.065 4.271 5.812 4.451 2.315 7.833 3.224 10.035 .5 12.237 3.224 15.619 2.315 15.799 5.812 19.07 7.065"
                />
              </g>
            </svg>
            <div>New</div>
          </button>
          <button
            class="flex flex-row items-center justify-center h-full p-2 focus:outline-none rounded-full"
            :class="[
              sort === 'points' ? 'bg-gray-200 dark:bg-dark-gray-700' : '',
            ]"
            @click="sort = 'points'"
          >
            <svg
              class="fill-current inline h-full w-8 mr-2"
              viewBox="0 0 512.002 512.002"
            >
              <g>
                <path
                  d="M511.267,197.258c-1.764-5.431-6.457-9.389-12.107-10.209l-158.723-23.065L269.452,20.157    c-2.526-5.12-7.741-8.361-13.45-8.361c-5.71,0-10.924,3.241-13.451,8.361l-70.988,143.827l-158.72,23.065    c-5.649,0.82-10.344,4.778-12.108,10.208c-1.765,5.431-0.293,11.392,3.796,15.377l114.848,111.954L92.271,482.671    c-0.966,5.628,1.348,11.314,5.967,14.671c2.613,1.898,5.708,2.864,8.818,2.864c2.388,0,4.784-0.569,6.978-1.723l141.967-74.638    l141.961,74.637c5.055,2.657,11.178,2.215,15.797-1.141c4.619-3.356,6.934-9.044,5.969-14.672l-27.117-158.081l114.861-111.955    C511.56,208.649,513.033,202.688,511.267,197.258z"
                />
              </g>
            </svg>
            <div>Top</div>
          </button>
        </div>
        <PostC
          v-for="postData in posts"
          :key="postData._id"
          :postData="postData"
        />
      </div>
      <About />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import About from "./About.vue";
import PostC from "./Post.vue";
import type { Post, Sub } from "../store/modules/types";

export default defineComponent({
  name: "Content",
  components: {
    About,
    PostC,
  },
  data: function() {
    return {
      sort: "points",
      order: -1,
    };
  },
  computed: {
    posts(): Post[] {
      return this.$store.direct.state.DataMod.subs[0].posts ?? []
    },
  },
  watch: {
    sort: function() {
      this.$store.direct.dispatch.DataMod.subInit({subName: this.$route.params.sub as string, order: this.order, sortBy: this.sort})
    },
  },
});
</script>
