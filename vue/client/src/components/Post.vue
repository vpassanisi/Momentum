<template>
  <div
    @click="$router.push(`/s/${$route.params.sub}/comments/${postData._id}`)"
    class="flex flex-row w-full bg-white dark:bg-dark-gray-800 mb-8 shadow border border-gray-400 hover:border-gray-600 dark:border-gray-700 dark:hover:border-gray-500 rounded cursor-pointer"
  >
    <div class="bg-gray-200 dark:bg-gray-900 p-3 rounded-l min-w-12">
      <button
        class="flex w-full focus:outline-none"
        :class="[
          isActive
            ? 'text-green-600 dark:text-green-500'
            : 'text-gray-900 dark:text-gray-400',
        ]"
        @click="
          (e) => {
            e.stopPropagation();
            handleUp();
          }
        "
      >
        <div class="w-full py-2">
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
        </div>
      </button>
      <div class="w-full text-center">
        {{
          postData.points > 999
            ? `${(postData.points / 1000).toPrecision(2)}k`
            : postData.points
        }}
      </div>
      <button
        class="flex w-full focus:outline-none py-2"
        :class="[
          isActive === false
            ? 'text-red-600 dark:text-red-500'
            : 'text-gray-900 dark:text-gray-400',
        ]"
        @click="
          (e) => {
            e.stopPropagation();
            handleDown();
          }
        "
      >
        <div class="w-full">
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
        </div>
      </button>
    </div>
    <div class="p-4">
      <div class="text-sm text-gray-700 dark:text-gray-500">
        Posted by {{ postData.user.name }} • {{ formatedTime }} ago
      </div>
      <div class="text-2xl font-medium">{{ postData.title }}</div>
      <read-only-editor :value="postData.body" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import ReadOnlyEditor from "./ReadOnlyEditor.vue"
import type {Post} from "../store/modules/types"

export default defineComponent({
  name: "Post",
  components: {
    ReadOnlyEditor
  },
  props: {
    postData: {
      type: Object as PropType<Post>,
      required: true,
    },
  },
  data() {
    return {
      isActive: undefined as boolean | undefined,
      formatedTime: null as string | null,
    };
  },
  computed: {
    isAuthenticated(): boolean {
      return this.$store.direct.state.AuthMod.isAuthenticated
    },
    points(): Record<string, boolean> {
      return this.$store.direct.state.PointMod.points;
    },
  },
  methods: {
    async handleUp() {
      if (!this.isAuthenticated) return;
      if (this.isActive === true) {
        this.isActive = undefined;
        await this.$store.direct.dispatch.removePostPoint(this.postData._id)
      } else {
        this.isActive = true;
        await this.$store.direct.dispatch.incrementPost(this.postData._id)
      }
    },
    async handleDown() {
      if (!this.isAuthenticated) return;
      if (this.isActive === false) {
        this.isActive = undefined;
        await this.$store.direct.dispatch.removePostPoint(this.postData._id)
      } else {
        this.isActive = false;
        await this.$store.direct.dispatch.decrementPost(this.postData._id)
      }
    },
  },
  mounted: async function() {
    this.formatedTime = await this.$store.direct.dispatch.getTimeSince(this.postData.createdAt)

    this.isActive = this.points[this.postData._id];
  },
  watch: {
    points: function() {
      this.isActive = this.points[this.postData._id];
    },
  },
});
</script>
