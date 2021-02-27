<template>
  <div class="relative w-full" v-if="isAuthenticated">
    <button
      v-if="closeButton"
      class="absolute flex z-10 right-0 mt-2 mr-2"
      @click="close"
    >
      <i class="material-icons">clear</i>
    </button>
    <small class="dark:text-gray-400 text-gray-500"
      >comment as {{ name }}</small
    >
    <div ref="newCommentContainer" class="mt-2">
      <div ref="newCommentEditor" style="min-height: 10rem;" />
      <div
        class="flex items-center justify-end border-l border-r border-b border-gray-400 p-1"
      >
        <button
          class="bg-blue-100 dark:bg-blue-400 px-4 py-1 rounded"
          @click="handleComment"
        >
          comment
        </button>
      </div>
    </div>
  </div>
  <div
    v-else
    class="flex flex-wrap justify-between rounded border border-gray-400 dark:border-gray-700 p-4 bg-blue-50 dark:bg-dark-gray-700 shadow"
  >
    <div
      class="flex items-center justify-center font-medium text-center pb-4 md:pt-4 w-full md:w-auto"
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
import { defineComponent } from "vue";
import Quill from "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";

export default defineComponent({
  name: "NewCommentEditor",
  props: {
    postId: {
      type: String,
      required: true,
    },
    parentId: {
      type: String,
      required: true,
    },
    rootId: {
      type: String,
      required: true,
    },
    closeButton: Boolean,
  },
  data() {
    return {
      editor: null as null | Quill,
      body: "",
    };
  },
  computed: {
    isAuthenticated(): boolean {
      return this.$store.direct.state.AuthMod.isAuthenticated;
    },
    isDarkMode(): boolean {
      return this.$store.direct.state.DarkModeMod.isDarkMode;
    },
    name(): string {
      return this.$store.direct.state.AuthMod.name;
    },
  },
  methods: {
    openLoginModal() {
      this.$store.direct.commit.openLoginModal();
    },
    async handleComment() {
      await this.$store.direct.dispatch.DataMod.newComment({
        postID: this.postId,
        body: this.body,
        parentID: this.parentId,
        rootID: this.rootId,
      });
      this.$emit("close");
    },
    close() {
      this.$emit("close");
    },
  },
  mounted() {
    this.editor = new Quill(this.$refs.newCommentEditor as string, {
      bounds: this.$refs.newCommentContainer as string,
      theme: "snow",
      readOnly: false,
      placeholder: ". . .",
    });

    this.editor.on("text-change", () => {
      if (this.editor) {
        this.body = this.editor.root.innerHTML;
      }
    });
  },
});
</script>
