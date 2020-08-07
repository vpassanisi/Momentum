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
import Vue from "vue";
import { mapState, mapActions } from "vuex";

const Component = Vue.extend({
  name: "DarkModeToggle",
  computed: mapState("darkMode", ["isDarkMode"]),
  methods: {
    ...mapActions("darkMode", ["turnOn", "turnOff"]),
    toggleDarkMode() {
      this.isDarkMode ? this.turnOff() : this.turnOn();
    },
  },
});
export default Component;
</script>
