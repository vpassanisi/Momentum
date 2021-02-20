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
import {defineComponent} from "vue";

const Component = defineComponent({
  name: "DarkModeToggle",
  computed: {
    isDarkMode(): boolean {
      return this.$store.state.DarkModeState.isDarkMode
    }
  },
  methods: {
    turnOn() {
      this.$store.dispatch("DarkModeState/turnOn")
    },
    turnOff() {
      this.$store.dispatch("DarkModeState/turnOff")
    },
    toggleDarkMode() {
      this.isDarkMode ? this.turnOff() : this.turnOn();
    },
  },
});
export default Component;
</script>
