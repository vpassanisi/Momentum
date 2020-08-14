<template>
  <div v-if="isAuthenticated">
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
            @click="handleComment"
          >
            COMMENT
          </button>

          <button
            v-if="closeButton"
            class="flex m-1 p-2 focus:outline-none"
            @click="$emit('close')"
          >
            <i class="material-icons">close</i>
          </button>
        </div>
      </div>
    </editor-menu-bar>
  </div>
  <div
    v-else
    class="flex flex-wrap justify-between rounded border border-gray-400 dark:border-gray-700 p-4 bg-blue-50 dark:bg-dark-gray-700 shadow"
  >
    <div
      class="flex items-center justify-center font-medium text-center pb-4 md:pt-4 w-full md:w-auto "
    >
      Log in or sign up to leave a comment
    </div>
    <div class="flex items-center justify-center w-full md:w-auto">
      <button
        class="rounded shadow px-4 py-2 mx-2 border border-blue-500 transition-button duration-300 ease-in-out focus:outline-none"
        :class="[isDarkMode ? 'hover:bg-blue-500' : 'hover:bg-blue-100']"
        @click="openLoginModal"
      >
        LOG IN
      </button>
      <button
        class="rounded shadow px-4 py-2 mx-2 border border-blue-500 transition-button duration-300 ease-in-out focus:outline-none"
        :class="[
          isDarkMode
            ? 'bg-blue-700 hover:bg-blue-400'
            : 'bg-blue-100 hover:bg-blue-300',
        ]"
      >
        SIGN UP
      </button>
    </div>
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
    parent: String,
    closeButton: Boolean,
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
    ...mapActions("EventState", ["openLoginModal"]),
    ...mapActions("PostState", ["newCommentByPost"]),
    async handleComment() {
      await this.newCommentByPost({
        postId: this.postId,
        comment: this.commentJSON,
        parent: this.parent,
      });
      this.$emit("close");
    },
  },
});
</script>
