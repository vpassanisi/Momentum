<template>
  <section v-if="sub">
    <Banner :img="sub.banner" />
    <Header :name="sub.name" :icon="sub.icon" />
    <Content />
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Banner from "../components/Banner.vue";
import Header from "../components/Header.vue";
import Content from "../components/Content.vue";
import { Sub } from "../store/modules/types";
import store from "@/store";

export default defineComponent({
  name: "Sub",
  components: {
    Banner,
    Header,
    Content,
  },
  computed: {
    subError(): string {
      return this.$store.direct.state.SubMod.subError;
    },
    sub(): Sub | null {
      return this.$store.direct.state.SubMod.sub;
    },
    isAuthenticated(): boolean {
      return this.$store.direct.state.AuthMod.isAuthenticated;
    },
  },
  mounted: async function() {
    await this.$store.direct.dispatch.SubMod.subAndPosts({
      sub: this.$route.params.sub as string,
      sort: "points",
      order: -1,
    });

    if (this.subError) this.$router.push("/NotFound");
    if (this.isAuthenticated)
      this.$store.direct.dispatch.getPoints(
        this.$store.direct.getters.SubMod.targetIDs
      );
  },
});
</script>
