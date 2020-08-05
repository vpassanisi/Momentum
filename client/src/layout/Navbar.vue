<template>
  <nav
    class="fixed top-0 left-0 w-full flex flex-row items-center justify-center bg-white transition-all duration-500 ease-in-out"
    v-bind:class="[scroll === 0 ? 'h-20' : 'h-10']"
  >
    <div class="w-90p h-full">
      <button class="h-full">Project-S</button>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from "vue";

const Component = Vue.extend({
  name: "Navbar",
  data: function() {
    return {
      scroll: document.documentElement.scrollTop
    };
  },
  mounted: function() {
    document.addEventListener(
      "scroll",
      () => (this.scroll = document.documentElement.scrollTop)
    );
  }
});

export default Component;
</script>