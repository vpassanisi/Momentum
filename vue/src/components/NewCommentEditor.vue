<template>
  <div class="relative w-full" v-if="isAuthenticated">
    <button
      v-if="closeButton"
      class="absolute flex z-10 right-0 mt-2 mr-2"
      @click="close"
    >
      <i class="material-icons">clear</i>
    </button>
    <quill-editor :theme="'snow'" :readOnly="false" />
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
import { mapActions } from "vuex";
import QuillEditor from "./QuillEditor.vue";

export default defineComponent({
  name: "NewCommentEditor",
  props: {
    postId: String,
    parentId: String,
    rootId: String,
    closeButton: Boolean,
  },
  components: {
    QuillEditor,
  },
  data() {
    return {
      linkMenuIsActive: false,
      newCommentBounds: this.$refs.newCommentBounds,
    };
  },
  computed: {
    isAuthenticated(): boolean {
      return this.$store.state.AuthState.isAuthenticated;
    },
    isDarkMode(): boolean {
      return this.$store.state.DarkModeState.isDarkMode;
    },
  },
  methods: {
    ...mapActions("EventState", ["openLoginModal"]),
    ...mapActions("CommentState", ["newCommentByPost"]),
    async handleComment() {
      await this.newCommentByPost({
        postId: this.postId,
        body: "",
        parentId: this.parentId,
        rootId: this.rootId,
      });
      this.$emit("close");
    },
    close() {
      this.$emit("close");
    },
  },
});
</script>
