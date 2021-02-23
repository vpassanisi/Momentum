<template>
  <section v-if="sub">
    <Banner :img="sub.banner" />
    <Header :name="sub.name" :icon="sub.icon" />
    <Content />
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions } from "vuex";
import Banner from "../components/Banner.vue";
import Header from "../components/Header.vue";
import Content from "../components/Content.vue";
import { Sub } from "../store/modules/SubState";

export default defineComponent({
  name: "Sub",
  components: {
    Banner,
    Header,
    Content,
  },
  computed: {
    subError(): string {
      return this.$store.state.SubState.subError;
    },
    sub(): Sub | null {
      return this.$store.state.SubState.sub;
    },
    isAuthenticated(): boolean {
      return this.$store.state.AuthState.isAuthenticated;
    },
  },
  methods: {
    ...mapActions("PointState", ["getPoints"]),
  },
  mounted: async function() {
    await this.$store.dispatch("SubState/subAndPosts", {
      sub: this.$route.params.sub,
      sort: "points",
      order: -1,
    });

    if (this.subError) this.$router.push("/NotFound");
    if (this.isAuthenticated)
      this.$store.dispatch(
        "PointState/getPoints",
        this.$store.getters["SubState/targetIDs"]
      );
  },
});
</script>
