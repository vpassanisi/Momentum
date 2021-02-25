<template>
  <button
    v-on:click="toggleDarkMode"
    class="flex items-center h-full px-2 hover:bg-white-alpha-30 transition-colors duration-300 ease-in-out focus:outline-none"
  >
    <i v-if="isDarkMode" class="material-icons">brightness_7</i>
    <i v-else class="material-icons">brightness_4</i>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

const Component = defineComponent({
  name: "DarkModeToggle",
  computed: {
    isDarkMode(): boolean {
      return this.$store.direct.state.DarkModeMod.isDarkMode;
    },
  },
  methods: {
    turnOn() {
      this.$store.direct.dispatch.turnOn();
    },
    turnOff() {
      this.$store.direct.dispatch.turnOff();
    },
    toggleDarkMode() {
      this.isDarkMode ? this.turnOff() : this.turnOn();
    },
  },
});
export default Component;
</script>
