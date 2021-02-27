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

export default defineComponent({
  name: "Sub",
  components: {
    Banner,
    Header,
    Content,
  },
  computed: {
    dataError(): string {
      return this.$store.direct.state.DataMod.error;
    },
    sub(): Sub {
      return this.$store.direct.state.DataMod.subs[0];
    },
    isAuthenticated(): boolean {
      return this.$store.direct.state.AuthMod.isAuthenticated;
    },
  },
  mounted: async function() {
    await this.$store.direct.dispatch.DataMod.subInit({
      subName: this.$route.params.sub as string,
      order: -1,
      sortBy: "points",
    });

    if (this.dataError) this.$router.push("/NotFound");
    if (this.isAuthenticated)
      this.$store.direct.dispatch.getPoints(
        this.$store.direct.getters.DataMod.targetIDs
      );
  },
});
</script>
