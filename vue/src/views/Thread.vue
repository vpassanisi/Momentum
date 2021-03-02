<template>
  <div v-if="post && sub" class="flex justify-center mt-32">
    <div class="grid gap-6 grid-cols-1 md:grid-cols-3 w-90p max-w-screen-lg">
      <div
        class="md:col-span-2 p-4 rounded bg-white dark:bg-dark-gray-800 shadow border border-gray-400 dark:border-gray-700 mb-12"
      >
        <div class="flex flex-row">
          <div class="flex flex-col w-6">
            <button
              class="w-full focus:outline-none py-2"
              :class="[
                isActive === true
                  ? 'text-green-600 dark:text-green-500'
                  : 'text-gray-900 dark:text-gray-400',
              ]"
              @click="handleUp"
            >
              <svg
                viewBox="100 14.653 300 168.661"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  d="M 379.784 183.315 L 120.215 183.315 C 102.241 183.315 93.24 161.772 105.949 149.173 L 235.734 20.511 C 243.613 12.701 256.387 12.701 264.265 20.511 L 394.05 149.173 C 406.76 161.772 397.758 183.315 379.784 183.315 Z"
                  class
                  style
                />
              </svg>
            </button>
            <div class="w-full text-center">
              {{
                post.points > 999
                  ? `${(post.points / 1000).toPrecision(2)}k`
                  : post.points
              }}
            </div>
            <button
              class="w-full focus:outline-none py-2"
              :class="[
                isActive === false
                  ? 'text-red-600 dark:text-red-500'
                  : 'text-gray-900 dark:text-gray-400',
              ]"
              @click="handleDown"
            >
              <svg
                viewBox="100 14.112 300 168.65"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  d="M 120.186 14.112 L 379.814 14.112 C 397.775 14.112 406.756 35.612 394.042 48.212 L 264.278 176.912 C 256.408 184.712 243.593 184.712 235.722 176.912 L 105.958 48.212 C 93.244 35.612 102.225 14.112 120.186 14.112 Z"
                  class
                  style
                />
              </svg>
            </button>
          </div>
          <div>
            <div class="text-sm text-gray-700 dark:text-gray-500 pl-4">
              Posted by {{ post.user.name }} • {{ formatedTime }} ago
            </div>
            <div class="text-xl font-medium pl-4">{{ post.title }}</div>
            <div class="p-4">
              <read-only-editor :value="post.body" />
            </div>
          </div>
        </div>
        <div class="flex">
          <NewCommentEditor
            :postId="post._id"
            :parentId="post._id"
            :rootId="'000000000000000000000000'"
            :closeButton="false"
          />
        </div>
        <div class="border-b border-gray-400 dark:border-gray-700 my-4" />
        <div class="inline-block">
          <div
            class="flex flex-row justify-start rounded border border-gray-400 dark:border-gray-700 px-4 py-2 bg-blue-50 dark:bg-dark-gray-700 shadow"
          >
            Sort By:
            <select
              name="sort"
              class="focus:outline-none ml-2 bg-transparent border-b border-gray-700 dark:border-gray-300"
              v-model="sort"
              @change="handleChangeSort"
            >
              <option value="points" class="focus:outline-none">Top</option>
              <option value="createdAt" class="focus:outline-none">New</option>
            </select>

            <button class="flex ml-4 focus:outline-none" @click="handleOrder">
              <i
                class="material-icons transition-transform transform duration-300 ease-in-out"
                :class="[order === 1 ? 'rotate-180' : '']"
                >south</i
              >
            </button>
          </div>
        </div>
        <comment-c
          v-for="com in comments[post._id]"
          :key="com._id"
          :comment="com"
          :rootId="com._id"
        />
        <div class="flex flex-row items-center justify-center mt-4">
          <button
            v-show="moreComments"
            class="w-1/2 bg-blue-500 text-white shadow rounded p-2 focus:outline-none"
            @click="handleNextComments"
          >
            Load More Comments
          </button>
        </div>
      </div>
      <About class="order-last" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CommentC from "../components/Comment.vue";
import About from "../components/About.vue";
import ReadOnlyEditor from "../components/ReadOnlyEditor.vue";
import { Sub, Post, Comment } from "../store/modules/types";
import NewCommentEditor from "../components/NewCommentEditor.vue";

export default defineComponent({
  name: "Thread",
  components: {
    About,
    CommentC,
    ReadOnlyEditor,
    NewCommentEditor,
  },
  data() {
    return {
      sort: "points",
      order: -1,
      isActive: undefined as undefined | boolean,
      formatedTime: null as null | string,
    };
  },
  computed: {
    lastValueCreatedAt(): number {
      return this.$store.direct.getters.DataMod.lastValueCreatedAt;
    },
    lastValuePoints(): number {
      return this.$store.direct.getters.DataMod.lastValuePoints;
    },
    post(): Post | undefined {
      return this.$store.direct.state.DataMod.subs?.[0]?.posts?.[0];
    },
    moreComments(): boolean {
      return this.$store.direct.state.DataMod.moreComments;
    },
    comments(): Record<string, Comment[]> {
      return (
        this.$store.direct.state.DataMod.subs?.[0]?.posts?.[0]?.commentsMap ??
        {}
      );
    },
    points(): Record<string, boolean> {
      return this.$store.direct.state.PointMod.points;
    },
    targetIDs(): readonly string[] {
      return this.$store.direct.getters.DataMod.targetIDs;
    },
    sub(): Sub | undefined {
      return this.$store.direct.state.DataMod.subs?.[0];
    },
    isAuthenticated(): boolean {
      return this.$store.direct.state.AuthMod.isAuthenticated;
    },
  },
  methods: {
    handleUp() {
      if (!this.isAuthenticated || !this.post) return;

      if (this.isActive === true) {
        this.isActive = undefined;
        this.$store.direct.dispatch.removePostPoint(this.post._id);
      } else {
        this.isActive = true;
        this.$store.direct.dispatch.incrementPost(this.post._id);
      }
    },
    handleDown() {
      if (!this.isAuthenticated || !this.post) return;

      if (this.isActive === false) {
        this.isActive = undefined;
        this.$store.direct.dispatch.removePostPoint(this.post._id);
      } else {
        this.isActive = false;
        this.$store.direct.dispatch.decrementPost(this.post._id);
      }
    },
    async handleChangeSort() {
      await this.$store.direct.dispatch.DataMod.threadInit({
        subName: this.$route.params.sub as string,
        postID: this.$route.params.id as string,
        sortBy: this.sort,
        order: this.order,
        lastValue: 0,
        lastCreatedAt: 0,
      });
      if (this.isAuthenticated)
        await this.$store.direct.dispatch.getPoints(this.targetIDs);
    },
    async handleOrder() {
      this.order = this.order === 1 ? -1 : 1;

      await this.$store.direct.dispatch.DataMod.threadInit({
        subName: this.$route.params.sub as string,
        postID: this.$route.params.id as string,
        sortBy: this.sort,
        order: this.order,
        lastValue: 0,
        lastCreatedAt: 0,
      });

      if (this.isAuthenticated)
        await this.$store.direct.dispatch.getPoints(this.targetIDs);
    },
    async handleNextComments() {
      await this.$store.direct.dispatch.DataMod.loadMoreComments({
        subName: this.$route.params.sub as string,
        postID: this.$route.params.id as string,
        sortBy: this.sort,
        order: this.order,
        lastValue:
          this.sort === "points"
            ? this.lastValuePoints
            : this.lastValueCreatedAt,
        lastCreatedAt: this.$store.direct.getters.DataMod.lastValueCreatedAt,
      });
      if (this.isAuthenticated)
        await this.$store.direct.dispatch.getPoints(this.targetIDs);
    },
  },
  mounted: async function() {
    await this.$store.direct.dispatch.DataMod.threadInit({
      subName: this.$route.params.sub as string,
      postID: this.$route.params.id as string,
      sortBy: this.sort,
      order: this.order,
      lastValue: 0,
      lastCreatedAt: 0,
    });

    if (this.isAuthenticated)
      await this.$store.direct.dispatch.getPoints(this.targetIDs);

    if (this.post) {
      this.isActive = this.points[this.post._id];

      this.formatedTime = await this.$store.direct.dispatch.getTimeSince(
        this.post.createdAt
      );
    }
  },
  watch: {
    points: function() {
      if (this.post) {
        this.isActive = this.points[this.post._id];
      }
    },
  },
  beforeUnmount() {
    this.$store.direct.commit.DataMod.clearDataState();
    this.$store.direct.commit.clearPointState();
  },
});
</script>
