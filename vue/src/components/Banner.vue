<template>
  <span
    class="block bg-no-repeat bg-cover bg-center"
    :style="{
      backgroundColor: 'var(--primary)',
      backgroundImage: 'url(' + img + ')',
      height: '20rem',
    }"
  />
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Banner",
  props: {
    img: String,
  },
});
</script>
