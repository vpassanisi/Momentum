<template>
  <div class="mt-32">
    <div class="flex flex-col mx-auto w-11/12 max-w-screen-md">
      <SubCard v-for="sub in subsArr" :key="sub._id" :sub="sub" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapState } from "vuex";
import SubCard from "@/components/SubCard.vue";

export default Vue.extend({
  name: "Home",
  components: {
    SubCard,
  },
  computed: {
    ...mapState("SubState", ["subsArr"]),
  },
  methods: {
    ...mapActions("SubState", ["getSubs"]),
  },
  mounted: async function () {
    this.getSubs();
  },
});
</script>
