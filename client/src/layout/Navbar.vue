<template>
  <nav
    class="fixed top-0 left-0 w-full flex flex-row items-center justify-center bg-white dark:bg-dark-gray-900 transition-height duration-500 ease-in-out border-b border-gray-500"
    :class="[scroll === 0 ? 'h-20' : 'h-12']"
  >
    <div class="flex flex-row justify-between items-center w-90p h-full">
      <button class="h-full">Project-S</button>
      <div v-if="$mq === 'lg' || $mq === 'xl'" class="flex flex-row h-full">
        <div v-if="isAuthenticated" class="flex flex-row h-full">
          <button
            class="rounded shadow px-8 mx-2 border border-blue-500 transition-button duration-300 ease-in-out focus:outline-none"
            :class="[
              scroll === 0 ? 'my-4' : 'my-2',
              isDarkMode ? 'hover:bg-blue-500' : 'hover:bg-blue-100',
            ]"
            @click="handleLogout"
          >
            LOG OUT
          </button>
        </div>
        <div v-else class="flex flex-row h-full">
          <button
            class="rounded shadow px-8 mx-2 border border-blue-500 transition-button duration-300 ease-in-out focus:outline-none"
            :class="[
              scroll === 0 ? 'my-4' : 'my-2',
              isDarkMode ? 'hover:bg-blue-500' : 'hover:bg-blue-100',
            ]"
            @click="openLoginModal"
          >
            LOG IN
          </button>
          <button
            class="rounded shadow px-8 mx-2 border border-blue-500 transition-button duration-300 ease-in-out focus:outline-none"
            :class="[
              scroll === 0 ? 'my-4' : 'my-2',
              isDarkMode
                ? 'bg-blue-700 hover:bg-blue-400'
                : 'bg-blue-100 hover:bg-blue-300',
            ]"
          >
            SING UP
          </button>
        </div>
        <DarkModeToggle class="px-2" />
      </div>
      <button
        v-else
        class="flex h-full items-center justify-center focus:outline-none px-2"
        @click="openSidebar"
      >
        <i class="material-icons">menu</i>
      </button>
    </div>
    <LoginModal v-show="isLoginModalOpen" @closeModal="closeLoginModal" />
    <Sidebar
      v-show="isSidebarOpen"
      @logout="handleLogout"
      @openLoginModal="openLoginModal"
      @closeSidebar="closeSidebar"
    />
  </nav>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import DarkModeToggle from "@/components/DarkModeToggle.vue";
import LoginModal from "@/components/LoginModal.vue";
import Sidebar from "@/components/Sidebar.vue";

export default Vue.extend({
  name: "Navbar",
  components: {
    DarkModeToggle,
    LoginModal,
    Sidebar,
  },
  data: function() {
    return {
      scroll: document.documentElement.scrollTop,
      isLoginModalOpen: false,
      isSidebarOpen: false,
      perfersDark: window.matchMedia("(prefers-color-scheme: dark)").matches,
    };
  },
  computed: {
    ...mapState("AuthState", ["isAuthenticated"]),
    ...mapState("DarkMode", ["isDarkMode"]),
  },
  methods: {
    ...mapActions("AuthState", ["logout"]),
    ...mapActions("DarkMode", ["turnOn"]),
    closeLoginModal() {
      this.isLoginModalOpen = false;
    },
    closeSidebar() {
      this.isSidebarOpen = false;
    },
    openSidebar() {
      this.isSidebarOpen = true;
    },
    openLoginModal() {
      this.isLoginModalOpen = true;
    },
    handleLogout() {
      this.logout();
    },
  },
  mounted: function() {
    document.addEventListener(
      "scroll",
      () => (this.scroll = document.documentElement.scrollTop)
    );

    if (this.perfersDark) this.turnOn();
  },
});
</script>
