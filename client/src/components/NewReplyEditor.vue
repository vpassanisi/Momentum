<template>
  <div>
    <editor-content :editor="commentEditor" />
    <editor-menu-bar :editor="commentEditor" v-slot="{ commands, isActive }">
      <div
        class="flex flex-wrap justify-between border-l border-r border-b rounded-b border-gray-400 dark:border-gray-700 w-full"
      >
        <div class="flex flex-wrap items-center">
          <button
            class="flex p-2"
            :class="{
              'bg-gray-400': isActive.bold() && !isDarkMode,
              'bg-gray-700': isActive.bold() && isDarkMode,
            }"
            @click="commands.bold"
          >
            <i class="material-icons">format_bold</i>
          </button>

          <button
            class="flex p-2"
            :class="{
              'bg-gray-400': isActive.italic() && !isDarkMode,
              'bg-gray-700': isActive.italic() && isDarkMode,
            }"
            @click="commands.italic"
          >
            <i class="material-icons">format_italic</i>
          </button>

          <button
            class="flex p-2"
            :class="{
              'bg-gray-400': isActive.strike() && !isDarkMode,
              'bg-gray-700': isActive.strike() && isDarkMode,
            }"
            @click="commands.strike"
          >
            <i class="material-icons">format_strikethrough </i>
          </button>

          <button
            class="flex p-2"
            :class="{
              'bg-gray-400': isActive.underline() && !isDarkMode,
              'bg-gray-700': isActive.underline() && isDarkMode,
            }"
            @click="commands.underline"
          >
            <i class="material-icons">format_underline</i>
          </button>

          <button
            class="flex p-2"
            :class="{
              'bg-gray-400': isActive.code() && !isDarkMode,
              'bg-gray-700': isActive.code() && isDarkMode,
            }"
            @click="commands.code"
          >
            <i class="material-icons">code</i>
          </button>

          <button
            class="flex p-2"
            :class="{
              'bg-gray-400': isActive.paragraph() && !isDarkMode,
              'bg-gray-700': isActive.paragraph() && isDarkMode,
            }"
            @click="commands.paragraph"
          >
            P
          </button>

          <button
            class="flex p-2"
            :class="{
              'bg-gray-400': isActive.blockquote() && !isDarkMode,
              'bg-gray-700': isActive.blockquote() && isDarkMode,
            }"
            @click="commands.blockquote"
          >
            <i class="material-icons">format_quote</i>
          </button>

          <button
            class="flex p-2"
            :class="{
              'bg-gray-400': isActive.code_block() && !isDarkMode,
              'bg-gray-700': isActive.code_block() && isDarkMode,
            }"
            @click="commands.code_block"
          >
            <i class="material-icons">code</i>
          </button>

          <button
            class="flex p-2"
            @click="commands.undo"
            :class="[isDarkMode ? 'focus:bg-gray-700' : 'focus:bg-gray-400']"
          >
            <i class="material-icons">undo</i>
          </button>

          <button
            class="flex p-2"
            @click="commands.redo"
            :class="[isDarkMode ? 'focus:bg-gray-700' : 'focus:bg-gray-400']"
          >
            <i class="material-icons">redo</i>
          </button>
        </div>
        <div class="flex flex-row items-center justify-center">
          <button
            class="bg-primary-dark text-white m-1 px-4 py-2 rounded"
            @click="handleReply"
          >
            REPLY
          </button>

          <button
            class="flex m-1 p-2 focus:outline-none"
            @click="$emit('close')"
          >
            <i class="material-icons">close</i>
          </button>
        </div>
      </div>
    </editor-menu-bar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import { Editor, EditorContent, EditorMenuBar } from "tiptap";
import {
  Placeholder,
  Bold,
  Italic,
  Strike,
  Underline,
  Code,
  Blockquote,
  CodeBlock,
  History,
} from "tiptap-extensions";

export default Vue.extend({
  name: "NewCommentEditor",
  props: {
    postId: String,
    commentId: String,
    parentId: String,
  },
  components: {
    EditorContent,
    EditorMenuBar,
  },
  data() {
    return {
      commentJSON: {},
      commentEditor: new Editor({
        editorProps: {
          attributes: {
            class:
              "p-4 border border-gray-400 dark:border-gray-700 rounded-t focus:outline-none focus:border-gray-700 dark:focus:border-gray-400 min-h-32 position-inherit",
          },
        },
        extensions: [
          new Bold(),
          new Italic(),
          new Strike(),
          new Underline(),
          new Code(),
          new Blockquote(),
          new CodeBlock(),
          new History(),
          new Placeholder({
            emptyEditorClass:
              "text-gray-600 tiptap_placeholder is-editor-empty",
            emptyNodeClass: "is-empty",
            emptyNodeText: "Your Comment. . .",
            showOnlyWhenEditable: true,
            showOnlyCurrent: true,
          }),
        ],
        onUpdate: ({ getJSON }) => {
          this.$data.commentJSON = JSON.stringify(getJSON());
        },
      }),
    };
  },
  computed: {
    ...mapState("DarkMode", ["isDarkMode"]),
    ...mapState("AuthState", ["isAuthenticated"]),
  },
  methods: {
    ...mapActions("PostState", ["newReplyByPost"]),
    async handleReply() {
      await this.newReplyByPost({
        postId: this.postId,
        body: this.commentJSON,
        parentId: this.parentId,
        commentId: this.commentId,
      });
      this.$emit("close");
    },
  },
});
</script>
