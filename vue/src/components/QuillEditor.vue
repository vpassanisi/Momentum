<template>
  <div ref="container">
    <div ref="editor" v-html="value"></div>
  </div>
</template>

<script>
import Quill from "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

export default {
  props: {
    value: {
      type: String,
      default: "",
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: "bubble",
    },
  },

  data() {
    return {
      editor: null,
    };
  },
  mounted() {
    this.editor = new Quill(this.$refs.editor, {
      // modules: {
      //     toolbar: [
      //         [{ header: [1, 2, 3, 4, false] }],
      //         ['bold', 'italic', 'underline']
      //     ]
      // },
      bounds: this.$refs.container,
      theme: this.theme,
      readOnly: this.readOnly,
      // formats: ['bold', 'underline', 'header', 'italic']
    });

    this.editor.root.innerHTML = this.value;

    this.editor.on("text-change", () => {
      this.$emit(
        "input",
        this.editor.getText() ? this.editor.root.innerHTML : ""
      );
    });
  },
};
</script>
