<template>
  <main
    :style="
      `
    --primary: #1976D2;
    --primary-light: #E3F2FD;
    --primary-dark: #0D47A1;
  `
    "
  >
    <div id="colors">
      <Navbar />
      <router-view />
    </div>
  </main>
</template>

<script>
import Navbar from "@/layout/Navbar.vue";
import { mapActions } from "vuex";
export default {
  name: "App",
  components: {
    Navbar,
  },
  data() {
    return {
      colorsRef: this.$refs.colors,
    };
  },
  methods: {
    ...mapActions("MediaQueryState", ["init"]),
  },
  created: function() {
    this.init();
  },
};
</script>
