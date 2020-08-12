<template>
  <main>
    <Navbar />
    <router-view />
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
  methods: {
    ...mapActions("MediaQueryState", ["init"]),
  },
  created: function() {
    this.init();
  },
};
</script>
