<template>
  <div class="relative border border-blue-500 rounded" @click="handleClick">
    <slot name="button" />

    <transition name="dropdown" @after-enter="isOpen = true">
      <slot v-if="isOpen" name="content"></slot>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "DropDown",
  data: function() {
    return {
      isOpen: false,
    };
  },
  methods: {
    openLoginModal() {
      this.$store.direct.commit.openLoginModal();
    },
    logOut() {
      this.$store.direct.dispatch.logout();
    },
    handleClick() {
      this.isOpen ? (this.isOpen = false) : (this.isOpen = true);
    },
  },
});
</script>

<style scoped>
.dropdown-enter-from,
.dropdown-leave-active {
  opacity: 0;
  transform: translate(4%, -4%);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease-in-out, transform 0.15s ease-in-out;
}
</style>
