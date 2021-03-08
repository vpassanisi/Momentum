<template>
  <div
    class="relative bg-blue-50 dark:bg-dark-gray-800 border border-blue-50 dark:border-dark-gray-800 hover:border-gray-400 dark:hover:border-gray-400 rounded"
    @click="handleClick"
  >
    <slot name="button" />

    <transition name="dropdown" @after-enter="isOpen = true">
      <div v-if="isOpen">
        <button class="fixed inset-0 h-full w-full cursor-default" />
        <slot name="content"> </slot>
      </div>
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
