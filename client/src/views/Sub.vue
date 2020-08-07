<template>
  <section>
    <Banner v-if="sub" :img="sub.banner" />
    <Header v-if="sub" :name="sub.name" />
    <Content v-if="sub" />
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
  computed: mapState("currentSub", ["sub"]),
  methods: {
    ...mapActions("currentSub", ["getPosts"]),
  },
  mounted: function () {
    this.getPosts(this.$route.params.sub);
  },
});
</script>
