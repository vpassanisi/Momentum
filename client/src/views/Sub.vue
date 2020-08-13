<template>
  <section v-if="sub">
    <Banner :img="sub.banner" />
    <Header :name="sub.name" :icon="sub.icon" />
    <Content />
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import Banner from "@/components/Banner.vue";
import Header from "@/components/Header.vue";
import Content from "@/components/Content.vue";

export default Vue.extend({
  name: "Sub",
  components: {
    Banner,
    Header,
    Content,
  },
  computed: mapState("SubState", ["sub"]),
  methods: {
    ...mapActions("SubState", ["getPostsBySubName"]),
  },
  mounted: async function() {
    await this.getPostsBySubName(this.$route.params.sub);
  },
});
</script>
