<template>
  <section class="flex justify-center mt-32">
    <div class="flex flex-row justify-center w-90p max-w-screen-lg">
      <div class="w-2/3 mr-4">
        <div class="bg-white dark:bg-dark-gray-800 rounded shadow p-4">
          <input
            class="border bg-transparent border-gray-400 dark:border-gray-700 w-full rounded focus:outline-none focus:border-gray-700 placeholder-gray-600 dark:focus:border-gray-400 p-4 mb-4"
            type="text"
            placeholder="Title . . ."
            v-model="title"
          />
          <editor-menu-bar :editor="postEditor" v-slot="{ commands, isActive }">
            <div
              class="flex flex-row border-l border-r border-t rounded-t border-gray-400 w-full"
            >
              <button
                class="flex p-2"
                :class="{ 'bg-gray-400': isActive.bold() }"
                @click="commands.bold"
              >
                <i class="material-icons">format_bold</i>
              </button>
              <button
                class="flex p-2"
                :class="{ 'bg-gray-400': isActive.italic() }"
                @click="commands.italic"
              >
                <i class="material-icons">format_italic</i>
              </button>
            </div>
          </editor-menu-bar>
          <editor-content :editor="postEditor" />
        </div>
      </div>
      <div class="w-1/3 ml-4">
        <About v-if="sub !== null" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import About from "@/components/About.vue";
import { Editor, EditorContent, EditorMenuBar } from "tiptap";
import { Placeholder, Bold, Italic } from "tiptap-extensions";

// TODO: styling and ading buttons
export default Vue.extend({
  name: "CreatePost",
  components: {
    About,
    EditorContent,
    EditorMenuBar,
  },
  data() {
    return {
      title: "",
      postJSON: {},
      postEditor: new Editor({
        editorProps: {
          attributes: {
            class:
              "p-4 border border-gray-400 dark:border-gray-700 rounded-b focus:outline-none focus:border-gray-700 dark:focus:border-gray-400 min-h-64",
          },
        },
        extensions: [
          new Bold(),
          new Italic(),
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
          this.$data.json = getJSON();
        },
      }),
    };
  },
  beforeDestroy() {
    this.postEditor.destroy();
  },
  computed: {
    ...mapState("subState", ["sub"]),
    ...mapState("darkMode", ["isDarkMode"]),
  },
  methods: {
    ...mapActions("subState", ["getSubByName"]),
  },
  mounted: function() {
    this.getSubByName(this.$route.params.sub);
  },
});
</script>
