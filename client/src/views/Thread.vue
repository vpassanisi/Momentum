<template>
  <div v-if="post !== null && sub !== null" class="flex justify-center mt-32">
    <div class="grid gap-6 grid-cols-1 md:grid-cols-3 w-90p max-w-screen-lg">
      <div
        class="md:col-span-2 p-4 rounded bg-white dark:bg-dark-gray-800 shadow border border-gray-400 dark:border-gray-700"
      >
        <div class="text-xl font-medium">{{ post.title }}</div>
        <editor-content :editor="readOnlyEditor" />
        <NewCommentEditor :postId="post._id" :parent="post._id" />
        <div class="border-b border-gray-400 dark:border-gray-700 my-4" />
        <Comment
          v-for="com in comments[post._id]"
          :key="com._id"
          :comment="com"
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
    ...mapState("PostState", ["post", "comments"]),
    ...mapState("SubState", ["sub", "posts"]),
  },
  methods: {
    ...mapActions("PostState", ["getPostById"]),
    ...mapActions("SubState", ["getSubByName"]),
  },
  mounted: async function() {
    await this.getPostById(this.$route.params.id);

    this.readOnlyEditor.setContent(JSON.parse(this.post.body));

    await this.getSubByName(this.$route.params.sub);
  },
  beforeDestroy() {
    this.readOnlyEditor.destroy();
  },
});
</script>
