<template>
  <section class="flex justify-center mt-32">
    <div
      class="grid gap-6 grid-cols-1 md:grid-cols-3 justify-center w-11/12 max-w-screen-lg"
    >
      <div class="md:col-span-2">
        <div
          ref="newPostContainer"
          class="relative bg-white dark:bg-dark-gray-800 rounded shadow p-4"
        >
          <input
            class="border bg-transparent border-gray-400 dark:border-gray-700 w-full rounded focus:outline-none focus:border-gray-700 placeholder-gray-600 p-4 mb-4"
            type="text"
            placeholder="Title . . ."
            v-model="title"
          />
          <div ref="newPostEditor" />
          <div class="flex flex-row justify-end mt-4">
            <button
              class="rounded bg-primary dark:bg-primary-dark hover:bg-primary py-2 px-4"
              @click="handlePost"
            >
              POST
            </button>
          </div>
        </div>
      </div>
      <div>
        <About />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import About from "../components/About.vue";
import Quill from "quill";
import "quill/dist/quill.core.css";
import type {Sub} from "../store/modules/types"

export default defineComponent({
  name: "CreatePost",
  components: {
    About,
  },
  data() {
    return {
      title: "",
      body: "",
      linkUrl: null as string | null,
      linkMenuIsActive: false,
      editor: {} as Quill,
    };
  },
  computed: {
    sub(): Sub | undefined {
      return this.$store.direct.state.DataMod.subs[0]
    },
    isAuthenticated(): boolean {
      return this.$store.direct.state.AuthMod.isAuthenticated;
    },
    isAuthLoading(): boolean {
      return this.$store.direct.state.AuthMod.isAuthLoading;
    },
  },
  methods: {
    async handlePost() {
      if(!this.sub) return
      await this.$store.direct.dispatch.DataMod.createPost({
        title: this.title,
        body: this.body,
        subID: this.sub._id,
      });
    },
    imageHandler() {
      const range = this.editor.getSelection();
      const value = prompt("please copy paste the image url here.");
      if (value && range) {
        this.editor.insertEmbed(range.index, "image", value, "user");
      }
    },
  },
  mounted() {
    this.$store.direct.dispatch.DataMod.createPostInit(
      this.$route.params.sub as string
    );

    this.editor = new Quill(this.$refs.newPostEditor as string, {
      modules: {
        toolbar: {
          container: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ color: ["#ff0000", "#00ff00", "#0000ff"] }],
            ["link", "image"],
          ],
          handlers: {
            image: this.imageHandler,
          },
        },
      },
      bounds: this.$refs.newPostContainer as string,
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
  watch: {
    isAuthenticated: function() {
      if (!this.isAuthenticated && !this.isAuthLoading) {
        this.$router.push(`/s/${this.$route.params.sub}`);
      }
    },
  },
});
</script>

<style>
.dark .ql-picker-options {
  color: black;
}
</style>
