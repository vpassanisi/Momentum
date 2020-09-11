<template>
  <section class="flex justify-center mt-32">
    <div class="grid gap-6 grid-cols-1 md:grid-cols-3 justify-center w-90p max-w-screen-lg">
      <div class="md:col-span-2">
        <div class="relative bg-white dark:bg-dark-gray-800 rounded shadow p-4">
          <input
            class="border bg-transparent border-gray-400 dark:border-gray-700 w-full rounded focus:outline-none focus:border-gray-700 placeholder-gray-600 dark:focus:border-gray-400 p-4 mb-4"
            type="text"
            placeholder="Title . . ."
            v-model="title"
          />
          <editor-menu-bar :editor="postEditor" v-slot="{ commands, isActive }">
            <div
              class="flex flex-wrap border-l border-r border-t rounded-t border-gray-400 dark:border-gray-700 w-full"
            >
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
                <i class="material-icons">format_strikethrough</i>
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
              >P</button>

              <button
                class="flex p-2"
                :class="{
                  'bg-gray-400': isActive.heading({ level: 1 }) && !isDarkMode,
                  'bg-gray-700': isActive.heading({ level: 1 }) && isDarkMode,
                }"
                @click="commands.heading({ level: 1 })"
              >H1</button>

              <button
                class="flex p-2"
                :class="{
                  'bg-gray-400': isActive.heading({ level: 2 }) && !isDarkMode,
                  'bg-gray-700': isActive.heading({ level: 2 }) && isDarkMode,
                }"
                @click="commands.heading({ level: 2 })"
              >H2</button>

              <button
                class="flex p-2"
                :class="{
                  'bg-gray-400': isActive.heading({ level: 3 }) && !isDarkMode,
                  'bg-gray-700': isActive.heading({ level: 3 }) && isDarkMode,
                }"
                @click="commands.heading({ level: 3 })"
              >H3</button>

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
                @click="commands.horizontal_rule"
                :class="[
                  isDarkMode ? 'focus:bg-gray-700' : 'focus:bg-gray-400',
                ]"
              >
                <i class="material-icons">horizontal_rule</i>
              </button>

              <button
                class="flex p-2"
                :class="[
                  isDarkMode ? 'focus:bg-gray-700' : 'focus:bg-gray-400',
                ]"
                @click="showImagePrompt(commands.image)"
              >
                <i class="material-icons">add_a_photo</i>
              </button>

              <button
                class="flex p-2"
                @click="commands.undo"
                :class="[
                  isDarkMode ? 'focus:bg-gray-700' : 'focus:bg-gray-400',
                ]"
              >
                <i class="material-icons">undo</i>
              </button>

              <button
                class="flex p-2"
                @click="commands.redo"
                :class="[
                  isDarkMode ? 'focus:bg-gray-700' : 'focus:bg-gray-400',
                ]"
              >
                <i class="material-icons">redo</i>
              </button>
            </div>
          </editor-menu-bar>
          <editor-menu-bubble
            :editor="postEditor"
            @hide="hideLinkMenu"
            v-slot="{ commands, isActive, getMarkAttrs, menu }"
          >
            <div
              class="absolute flex z-20 bg-black rounded p-1 mb-2 transform -translate-x-1/2 border border-white transition-bubblemenu duration-300 ease-in-out text-white"
              :class="[ menu.isActive ? 'opacity-100 visible' : 'opacity-0 invisible' ]"
              :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
            >
              <form
                class="flex items-center"
                v-if="linkMenuIsActive"
                @submit.prevent="setLinkUrl(commands.link, linkUrl)"
              >
                <input
                  class="border-none outline-none bg-transparent"
                  type="text"
                  v-model="linkUrl"
                  placeholder="https://"
                  ref="linkInput"
                  @keydown.esc="hideLinkMenu"
                />
                <button
                  class="inline-flex bg-transparent border-0 py-1 px-2 ml-1 rounded cursor-pointer"
                  @click="setLinkUrl(commands.link, null)"
                  type="button"
                >
                  <i class="material-icons">close</i>
                </button>
              </form>

              <template v-else>
                <button
                  class="inline-flex bg-transparent border-0 py-1 px-2 rounded cursor-pointer"
                  @click="showLinkMenu(getMarkAttrs('link'))"
                  :class="{ 'is-active': isActive.link() }"
                >
                  <span>{{ isActive.link() ? 'Update Link' : 'Add Link'}}</span>
                  <i class="material-icons ml-2">link</i>
                </button>
              </template>
            </div>
          </editor-menu-bubble>
          <editor-content :editor="postEditor" />
          <div class="flex flex-row justify-end mt-4">
            <Button
              class="rounded bg-primary dark:bg-primary-dark py-2 px-4"
              @click="handlePost"
            >POST</Button>
          </div>
        </div>
      </div>
      <div>
        <About v-if="sub !== null" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import About from "@/components/About.vue";
import { Editor, EditorContent, EditorMenuBar, EditorMenuBubble } from "tiptap";
import {
  Placeholder,
  Bold,
  Italic,
  Strike,
  Underline,
  Code,
  Heading,
  Blockquote,
  CodeBlock,
  HorizontalRule,
  History,
  Image,
  Link,
} from "tiptap-extensions";

interface Attrs {
  href: string;
}

export default Vue.extend({
  name: "CreatePost",
  components: {
    About,
    EditorContent,
    EditorMenuBar,
    EditorMenuBubble,
  },
  data() {
    return {
      title: "",
      postJSON: "",
      linkUrl: null as string | null,
      linkMenuIsActive: false,
      postEditor: new Editor({
        editorProps: {
          attributes: {
            class:
              "p-4 border border-gray-400 dark:border-gray-700 rounded-b focus:outline-none focus:border-gray-700 dark:focus:border-gray-400 min-h-64 position-inherit",
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
          new History(),
          new Image(),
          new Link(),
          new Placeholder({
            emptyEditorClass:
              "text-gray-600 tiptap_placeholder is-editor-empty",
            emptyNodeClass: "is-empty",
            emptyNodeText: "Your Post. . .",
            showOnlyWhenEditable: true,
            showOnlyCurrent: true,
          }),
        ],
        onUpdate: ({ getJSON }) => {
          this.$data.postJSON = JSON.stringify(getJSON());
        },
      }),
    };
  },
  beforeDestroy() {
    this.postEditor.destroy();
  },
  computed: {
    ...mapState("SubState", ["sub"]),
    ...mapState("DarkMode", ["isDarkMode"]),
    ...mapState("AuthState", ["isAuthenticated"]),
  },
  methods: {
    ...mapActions("SubState", ["getSubByName"]),
    ...mapActions("PostState", ["createPost"]),
    async handlePost() {
      await this.createPost({
        subId: this.sub._id,
        post: {
          title: this.title,
          body: this.postJSON,
        },
      });
    },
    showImagePrompt(command: Function) {
      const src = prompt("Enter the url of your image here");
      if (src !== null) {
        command({ src });
      }
    },
    showLinkMenu(attrs: Attrs) {
      this.linkUrl = attrs.href;
      this.linkMenuIsActive = true;
      this.$nextTick(() => {
        const el = this.$refs.linkInput as HTMLInputElement;
        el.focus();
      });
    },
    hideLinkMenu() {
      this.linkUrl = null;
      this.linkMenuIsActive = false;
    },
    setLinkUrl(command: Function, url: string) {
      command({ href: url });
      this.hideLinkMenu();
    },
  },
  mounted: function () {
    this.getSubByName(this.$route.params.sub);
  },
  watch: {
    isAuthenticated: function () {
      this.$router.push(`/s/${this.$route.params.sub}`);
    },
  },
});
</script>
