<template>
  <div
    @click="$router.push(`/s/${$route.params.sub}/comments/${postData._id}`)"
    class="flex flex-row w-full bg-white dark:bg-dark-gray-800 mb-8 shadow border border-gray-400 dark:border-gray-700 rounded"
    :class="[isDarkMode ? 'hover:border-gray-400' : 'hover:border-gray-700']"
  >
    <div class="bg-gray-200 dark:bg-gray-900 p-3 rounded-l w-13">
      <button
        class="flex w-full text-gray-900 dark:text-gray-400"
        @click="(e) => e.stopPropagation()"
      >
        <div class="w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
            <path
              fill="currentColor"
              d="M288.662 352H31.338c-17.818 0-26.741-21.543-14.142-34.142l128.662-128.662c7.81-7.81 20.474-7.81 28.284 0l128.662 128.662c12.6 12.599 3.676 34.142-14.142 34.142z"
              class=""
            ></path>
          </svg>
        </div>
      </button>
      <div class="w-full text-center">
        {{
          postData.points > 999 ? `${postData.points / 1000}k` : postData.points
        }}
      </div>
      <button
        class="flex w-full text-gray-900 dark:text-gray-400"
        @click="(e) => e.stopPropagation()"
      >
        <div class="w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
            <path
              fill="currentColor"
              d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"
              class=""
            ></path>
          </svg>
        </div>
      </button>
    </div>
    <div class="p-4">
      <div class="text-sm text-gray-700 dark:text-gray-500">
        Posted by {{ postData.user.name }} {{ formatedTime }} ago
      </div>
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
        ],
      }),
    };
  },
  computed: {
    ...mapState("DarkMode", ["isDarkMode"]),
  },
  methods: {
    ...mapActions("EventState", ["getTimeSince"]),
    handleClick() {
      this.$router.push(`/${this.postData._id}`);
    },
  },
  beforeDestroy() {
    this.readOnlyEditor.destroy();
  },
  mounted: async function() {
    this.formatedTime = await this.getTimeSince(this.postData.createdAt);
  },
});
</script>
