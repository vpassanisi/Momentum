<template>
  <div
    class="flex items-start justify-center bg-white dark:bg-dark-gray-800 shadow"
  >
    <div class="w-90p max-w-screen-lg flex flex-row">
      <div
        class="rounded-full bg-primary  h-20 w-20 flex items-center justify-center border-4 transform -translate-y-4 overflow-hidden"
      >
        <img v-if="icon !== ''" :src="icon" alt="" />
        <i v-else class="material-icons text-5xl">question_answer</i>
      </div>
      <div class="text-4xl font-medium pl-4">/s/{{ name }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Header",
  props: {
    name: String,
    icon: String,
  },
});
</script>
