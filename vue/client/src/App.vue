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
import { defineComponent } from "vue";
import Navbar from "@/layout/Navbar.vue";
import "./css/tailwind.src.css";
export default defineComponent({
  name: "App",
  components: {
    Navbar,
  },
  data() {
    return {
      colorsRef: this.$refs.colors,
    };
  },
  watch: {
    $route(to, from) {
      document.title = to.params.sub || to.meta.title || "Momentum";
    },
  },
});
</script>
