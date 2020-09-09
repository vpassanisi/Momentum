<template>
  <div>
    <button class="w-full focus:outline-none" @click="handleOpen">
      <slot name="main" />
    </button>
    <div
      class="w-full transition-max-height duration-500 ease-in-out overflow-hidden border-b border-gray-300 dark:border-gray-600"
      :class="[isOpen ? 'max-h-full' : 'max-h-0']"
    >
      <slot name="content" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Collapse",
  data: function () {
    return {
      isOpen: false,
    };
  },
  methods: {
    handleOpen() {
      this.isOpen ? (this.isOpen = false) : (this.isOpen = true);
    },
  },
});
</script>