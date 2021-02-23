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
import { defineComponent } from "vue";

export default defineComponent({
  name: "Banner",
  props: {
    img: String,
  },
});
</script>
