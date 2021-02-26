<template>
  <div ref="container" class="relative container placeholder-red-500">
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
      default: "",
    },
  },

  data() {
    return {
      editor: null,
    };
  },
  mounted() {
    this.editor = new Quill(this.$refs.editor, {
      bounds: this.$refs.container,
      theme: this.theme,
      readOnly: this.readOnly,
      placeholder: ". . .",
    });

    this.editor.root.innerHTML = this.value;

    this.editor.on("text-change", () => {
      this.$emit("input", this.editor.root.innerHTML);
    });
  },
};
</script>

<style>
.dark .ql-toolbar .ql-stroke {
  fill: none;
  stroke: #fff;
}

.dark .ql-toolbar .ql-fill {
  fill: #fff;
  stroke: none;
}

.dark .ql-toolbar .ql-picker {
  color: #fff;
}
</style>
