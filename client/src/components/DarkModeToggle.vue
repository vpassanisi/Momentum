<template>
  <div>toggle</div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, mapActions } from "vuex";

const Component = Vue.extend({
  name: "DarkModeToggle",
  computed: mapState("darkMode", ["isDarkMode"]),
  mounted: function() {
    console.log(this);
  }
});

export default Component;
</script>