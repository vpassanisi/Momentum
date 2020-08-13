<template>
  <router-link
    :to="{ path: `comments/${postData._id}` }"
    append
    class="inline-block w-full bg-white dark:bg-dark-gray-800 p-4 mb-8 shadow border border-gray-400 dark:border-gray-700 rounded"
    :class="[isDarkMode ? 'hover:border-gray-400' : 'hover:border-gray-700']"
  >
    <div class="text-2xl font-medium">{{ postData.title }}</div>
    <editor-content :editor="readOnlyEditor" />
  </router-link>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { mapState } from "vuex";
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

interface Post {
  _id: string;
  title: string;
  body: string;
  user: string;
  sub: string;
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
      readOnlyEditor: new Editor({
        content: JSON.parse(this.postData.body),
        editable: false,
        editorProps: {
          attributes: {
            class: "p-4 position-inherit",
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
  computed: mapState("DarkMode", ["isDarkMode"]),
  methods: {
    handleClick() {
      this.$router.push(`/${this.postData._id}`);
    },
  },
  beforeDestroy() {
    this.readOnlyEditor.destroy();
  },
});
</script>
