<template>
  <div class="mt-32">
    <div class="flex flex-col mx-auto w-11/12 max-w-screen-md">
      <SubCard v-for="sub in subsArr" :key="sub._id" :sub="sub" />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import SubCard from "../components/SubCard.vue";
import type {Sub} from "../store/modules/types"

export default defineComponent({
  name: "Home",
  components: {
    SubCard,
  },
  computed: {
    subsArr(): Sub[] {
      return this.$store.direct.state.SubMod.subsArr
    },
  },
  mounted: async function () {
    this.$store.direct.dispatch.SubMod.getSubs()
  },
});
</script>
