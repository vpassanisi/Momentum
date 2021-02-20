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
import type {Sub} from "../store/modules/SubState"

export default defineComponent({
  name: "Home",
  components: {
    SubCard,
  },
  computed: {
    subsArr(): Sub[] {
      return this.$store.state.SubState.subsArr
    },
  },
  mounted: async function () {
    this.$store.dispatch("SubState/getSubs")
  },
});
</script>
