<template>
  <div
    @click="$router.push(`/s/${$route.params.sub}/comments/${postData._id}`)"
    class="flex flex-row w-full bg-white dark:bg-dark-gray-800 mb-8 shadow border border-gray-400 dark:border-gray-700 rounded"
    :class="[isDarkMode ? 'hover:border-gray-400' : 'hover:border-gray-700']"
  >
    <div class="bg-gray-200 dark:bg-gray-900 p-3 rounded-l w-13">
      <button
        class="flex w-full focus:outline-none"
        :class="[
          isActive !== null && isActive
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
          <svg viewBox="100 14.653 300 168.661" xmlns="http://www.w3.org/2000/svg">
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
          isActive !== null && !isActive
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
          <svg viewBox="100 14.112 300 168.65" xmlns="http://www.w3.org/2000/svg">
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
      <div
        class="text-sm text-gray-700 dark:text-gray-500"
      >Posted by {{ postData.user.name }} • {{ formatedTime }} ago</div>
      <div class="text-2xl font-medium">{{ postData.title }}</div>
      <editor-content :editor="readOnlyEditor" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { mapState, mapActions } from "vuex";
import { Editor, EditorContent } from "tiptap";
import {
  Bold,
  Italic,
  Strike,
  Underline,
  Code,
  Heading,
  Blockquote,
  CodeBlock,
  HorizontalRule,
  Image,
  Link,
} from "tiptap-extensions";

interface User {
  _id: string;
  name: string;
  createdAt: number;
}

interface Post {
  _id: string;
  title: string;
  body: string;
  user: string;
  points: number;
  sub: User;
  createdAt: number;
}

export default Vue.extend({
  name: "Post",
  components: {
    EditorContent,
  },
  props: {
    postData: Object as PropType<Post>,
  },
  data() {
    return {
      isActive: null as null | boolean,
      formatedTime: null,
      readOnlyEditor: new Editor({
        content: JSON.parse(this.postData.body),
        editable: false,
        editorProps: {
          attributes: {
            class: "p-4 position-inherit focus:outline-none",
          },
        },
        extensions: [
          new Bold(),
          new Italic(),
          new Strike(),
          new Underline(),
          new Code(),
          new Heading({ levels: [1, 2, 3] }),
          new Blockquote(),
          new CodeBlock(),
          new HorizontalRule(),
          new Image(),
          new Link(),
        ],
      }),
    };
  },
  computed: {
    ...mapState("DarkMode", ["isDarkMode"]),
    ...mapState("AuthState", ["isAuthenticated"]),
    ...mapState("PointState", ["points"]),
  },
  methods: {
    ...mapActions("EventState", ["getTimeSince"]),
    ...mapActions("PointState", [
      "removePoint",
      "incrementPost",
      "decrementPost",
    ]),
    handleClick() {
      this.$router.push(`/${this.postData._id}`);
    },
    async handleUp() {
      if (!this.isAuthenticated) return;
      if (this.isActive === null || this.isActive === false) {
        this.isActive = true;
        await this.incrementPost(this.postData._id);
      } else {
        this.isActive = null;
        await this.removePoint({ targetId: this.postData._id, type: "post" });
      }
    },
    async handleDown() {
      if (!this.isAuthenticated) return;
      if (this.isActive === null || this.isActive === true) {
        this.isActive = false;
        await this.decrementPost(this.postData._id);
      } else {
        this.isActive = null;
        await this.removePoint({ targetId: this.postData._id, type: "post" });
      }
    },
  },
  beforeDestroy() {
    this.readOnlyEditor.destroy();
  },
  mounted: async function () {
    this.formatedTime = await this.getTimeSince(this.postData.createdAt);

    if (this.points[this.postData._id] !== undefined) {
      this.isActive = this.points[this.postData._id];
    }
  },
  watch: {
    points: function () {
      if (this.points[this.postData._id] !== undefined) {
        this.isActive = this.points[this.postData._id];
      } else {
        this.points[this.postData._id] = null;
      }
    },
  },
});
</script>
