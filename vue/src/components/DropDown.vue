<template>
  <div class="relative border border-blue-500 rounded" @click="handleClick">
    <slot name="button" />

    <transition name="dropdown" @after-enter="isOpen = true">
      <slot v-if="isOpen" name="content"></slot>
    </transition>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import { mapActions } from "vuex";

export default defineComponent({
  name: "DropDown",
  data: function () {
    return {
      isOpen: false,
    };
  },
  methods: {
    ...mapActions("EventState", ["openLoginModal"]),
    ...mapActions("AuthState", ["logout"]),
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
