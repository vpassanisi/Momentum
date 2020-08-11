<template>
  <transition name="fade" @enter="showSidebar = true">
    <div
      class="fixed top-0 bottom-0 left-0 right-0 h-full w-full bg-black bg-opacity-50"
      @click="close"
    >
      <transition name="slide">
        <div
          v-if="showSidebar"
          class="fixed flex flex-col items-center justify-start bg-white dark:bg-dark-gray-900 top-0 left-0 h-full w-45vw border-r dark:border-gray-400 border-gray-700 shadow"
          @click="(e) => e.stopPropagation()"
        >
          <div
            class="flex items-center justify-center h-20 border-b broder-gray-400 dark:border-gray-700 w-full"
          >
            <DarkModeToggle />
          </div>
          <button
            v-if="isAuthenticated"
            class="focus:outline-none rounded border border-blue-500 my-2 px-8 py-2 shadow"
            @click="
              () => {
                handleLogout();
                close();
              }
            "
          >
            LOG OUT
          </button>
          <div v-else class="flex flex-col h-full w-90p">
            <button
              class="focus:outline-none rounded border border-blue-500 my-2 px-8 py-2 shadow"
              @click="
                () => {
                  close();
                  openLoginModal();
                }
              "
            >
              LOG IN
            </button>
            <button
              class="focus:outline-none rounded border border-blue-500 my-2 px-8 py-2 shadow"
              :class="[isDarkMode ? 'bg-blue-700' : 'bg-blue-100']"
            >
              SIGN UP
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapState } from "vuex";
import DarkModeToggle from "./DarkModeToggle.vue";

export default Vue.extend({
  name: "Sidebar",
  components: {
    DarkModeToggle,
  },
  data() {
    return {
      showSidebar: false,
    };
  },
  computed: {
    ...mapState("AuthState", ["isAuthenticated"]),
    ...mapState("DarkMode", ["isDarkMode"]),
  },
  methods: {
    close() {
      this.showSidebar = false;
      this.$emit("closeSidebar");
    },
    openLoginModal() {
      this.$emit("openLoginModal");
    },
    handleLogout() {
      this.$emit("logout");
    },
  },
});
</script>
