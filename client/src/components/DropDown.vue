<template>
  <div class="relative w-40 border border-blue-500 rounded" @click="handleClick">
    <button
      class="flex flex-row items-center justify-between w-full h-full px-2 focus:outline-none"
    >
      s/{{$router.currentRoute.params.sub}}
      <i class="material-icons">arrow_drop_down</i>
    </button>

    <transition name="dropdown" @after-enter="isOpen = true">
      <slot v-if="isOpen" name="content"></slot>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "DropDown",
  data: function () {
    return {
      isOpen: false,
    };
  },
  methods: {
    handleClick() {
      this.isOpen ? (this.isOpen = false) : (this.isOpen = true);
    },
  },
});
</script>

<style scoped>
.dropdown-enter,
.dropdown-leave-active {
  opacity: 0;
  transform: translateY(-25%);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 200ms ease-in-out, transform 200ms ease-in-out;
}
</style>