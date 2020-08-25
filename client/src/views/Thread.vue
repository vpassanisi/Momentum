<template>
  <div v-if="post !== null && sub !== null" class="flex justify-center mt-32">
    <div class="grid gap-6 grid-cols-1 md:grid-cols-3 w-90p max-w-screen-lg">
      <div
        class="md:col-span-2 p-4 rounded bg-white dark:bg-dark-gray-800 shadow border border-gray-400 dark:border-gray-700"
      >
        <div class="flex flex-row">
          <div class="flex flex-col w-6">
            <button
              class="w-full text-gray-900 dark:text-gray-400 focus:outline-none py-2"
            >
              <svg
                viewBox="100 14.653 300 168.661"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  d="M 379.784 183.315 L 120.215 183.315 C 102.241 183.315 93.24 161.772 105.949 149.173 L 235.734 20.511 C 243.613 12.701 256.387 12.701 264.265 20.511 L 394.05 149.173 C 406.76 161.772 397.758 183.315 379.784 183.315 Z"
                  class=""
                  style=""
                />
              </svg>
            </button>
            <div class="w-full text-center">
              {{ post.points > 999 ? `${post.points / 1000}k` : post.points }}
            </div>
            <button
              class="w-full text-gray-900 dark:text-gray-400 focus:outline-none py-2"
            >
              <svg
                viewBox="100 14.112 300 168.65"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  d="M 120.186 14.112 L 379.814 14.112 C 397.775 14.112 406.756 35.612 394.042 48.212 L 264.278 176.912 C 256.408 184.712 243.593 184.712 235.722 176.912 L 105.958 48.212 C 93.244 35.612 102.225 14.112 120.186 14.112 Z"
                  class=""
                  style=""
                />
              </svg>
            </button>
          </div>
          <div>
            <div class="text-sm text-gray-700 dark:text-gray-500 pl-4">
              Posted by {{ post.user.name }} • {{ formatedTime }} ago
            </div>
            <div class="text-xl font-medium pl-4">{{ post.title }}</div>
            <editor-content :editor="readOnlyEditor" />
          </div>
        </div>
        <NewCommentEditor
          :postId="post._id"
          :parentId="post._id"
          :rootId="null"
          :closeButton="false"
        />
        <div class="border-b border-gray-400 dark:border-gray-700 my-4" />
        <Comment
          v-for="com in comments[post._id]"
          :key="com._id"
          :comment="com"
          :rootId="com._id"
        />
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
import NewCommentEditor from "@/components/NewCommentEditor.vue";
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
} from "tiptap-extensions";

export default Vue.extend({
  name: "Thread",
  components: {
    EditorContent,
    NewCommentEditor,
    About,
    Comment,
  },
  data() {
    return {
      formatedTime: null,
      readOnlyEditor: new Editor({
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
        ],
      }),
    };
  },
  computed: {
    ...mapState("PostState", ["post"]),
    ...mapState("CommentState", ["comments"]),
    ...mapState("PointState", ["targetIds"]),
    ...mapState("SubState", ["sub", "posts"]),
    ...mapState("AuthState", ["isAuthenticated"]),
  },
  methods: {
    ...mapActions("PostState", ["getPostAndComments", "clearPostState"]),
    ...mapActions("CommentState", ["clearCommentState"]),
    ...mapActions("PointState", ["getPoints", "clearPointState"]),
    ...mapActions("SubState", ["getSubByName"]),
    ...mapActions("EventState", ["getTimeSince"]),
  },
  mounted: async function() {
    await this.getPostAndComments(this.$route.params.id);

    if (this.isAuthenticated) await this.getPoints(this.targetIds);

    this.readOnlyEditor.setContent(JSON.parse(this.post.body));
    this.formatedTime = await this.getTimeSince(this.post.createdAt);

    await this.getSubByName(this.$route.params.sub);
  },
  beforeDestroy() {
    this.readOnlyEditor.destroy();

    this.clearPostState();
    this.clearCommentState();
    this.clearPointState();
  },
});
</script>
