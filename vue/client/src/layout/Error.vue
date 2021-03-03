<template>
  <div
    class="fixed bottom-0 left-0 right-0 flex items-center justify-center w-full h-16 bg-red-500 transform duration-300 ease-in-out z-20"
    :class="[authError || dataError ? '' : 'translate-y-16']"
  >
    <div class="h-full flex items-center justify-center text-2xl">
      {{ authError }}
      {{ dataError }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Error",
  computed: {
    authError(): string {
      return this.$store.direct.state.AuthMod.authError;
    },
    dataError(): string {
      return this.$store.direct.state.DataMod.error;
    },
  },
});
</script>
