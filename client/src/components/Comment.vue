<template>
  <div class="flex flex-row py-4">
    <div class="flex flex-col min-w-8 w-5p">
      <button class="w-full focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path
            fill="currentColor"
            d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"
            class=""
          ></path>
        </svg>
      </button>
      <button class="w-full focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path
            fill="currentColor"
            d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"
            class=""
          ></path>
        </svg>
      </button>
      <div
        class="border-r-2 border-gray-300 dark:border-gray-700 hover:border-gray-700 dark:hover:border-gray-300 w-50p h-full self-start"
      />
    </div>
    <editor-content :editor="readOnlyEditor" />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
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

interface Comment {
  _id: string;
  body: string;
  points: number;
  user: string;
  post: string;
  createdAt: number;
}

export default Vue.extend({
  name: "Comment",
  components: {
    EditorContent,
  },
  props: {
    comment: Object as PropType<Comment>,
  },
  data() {
    return {
      readOnlyEditor: new Editor({
        editable: false,
        content: this.comment.body,
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
});
</script>
