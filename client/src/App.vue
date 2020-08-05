<template>
  <main>
    <Navbar />
    <router-view />
  </main>
</template>

<script>
import Navbar from "@/layout/Navbar.vue";
export default {
  name: "App",
  components: {
    Navbar
  }
};
</script>