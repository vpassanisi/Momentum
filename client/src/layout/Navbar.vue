<template>
  <nav
    class="fixed top-0 left-0 w-full flex flex-row items-center justify-center bg-white dark:bg-dark-gray-900 transition-height duration-500 ease-in-out"
    v-bind:class="[scroll === 0 ? 'h-20' : 'h-10']"
  >
    <div class="flex flex-row justify-between items-center w-90p h-full">
      <button class="h-full">Project-S</button>
      <DarkModeToggle />
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from "vue";
import DarkModeToggle from "@/components/DarkModeToggle.vue";

export default Vue.extend({
  name: "Navbar",
  components: {
    DarkModeToggle,
  },
  data: function () {
    return {
      scroll: document.documentElement.scrollTop,
    };
  },
  mounted: function () {
    document.addEventListener(
      "scroll",
      () => (this.scroll = document.documentElement.scrollTop)
    );
  },
});
</script>
