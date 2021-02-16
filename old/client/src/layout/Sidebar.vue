<template>
  <transition name="fade" @enter="showSidebar = true">
    <div
      class="fixed top-0 bottom-0 left-0 right-0 h-full w-full bg-black bg-opacity-50"
      @click="close"
    >
      <transition name="slide">
        <div
          v-if="showSidebar"
          class="fixed flex flex-col items-center justify-start bg-white dark:bg-dark-gray-900 top-0 left-0 h-full w-1/2 border-r dark:border-gray-400 border-gray-700 shadow"
          @click="(e) => e.stopPropagation()"
        >
          <div
            class="flex items-center justify-center h-20 border-b broder-gray-400 dark:border-gray-700 w-full"
          >
            <DarkModeToggle />
          </div>
          <div class="flex flex-col h-full w-full">
            <button
              v-if="isAuthenticated"
              class="flex flex-row items-center justify-start focus:outline-none py-3 px-2 border-b border-gray-300 dark:border-gray-600"
              @click="
              () => {
                handleLogout();
                close();
              }
            "
            >LOG OUT</button>
            <button
              v-if="!isAuthenticated"
              class="flex flex-row items-center justify-start focus:outline-none py-3 px-2 border-b border-gray-300 dark:border-gray-600"
              @click="
                () => {
                  close();
                  openLoginModal();
                }
              "
            >LOG IN</button>
            <button
              v-if="!isAuthenticated"
              class="flex flex-row items-center justify-start focus:outline-none py-3 px-2 border-b border-gray-300 dark:border-gray-600"
            >SIGN UP</button>
            <Collapse>
              <template v-slot:main>
                <div
                  class="flex flex-row items-center justify-between focus:outline-none py-3 px-2"
                >
                  {{$router.currentRoute.params.sub ? $router.currentRoute.params.sub : $router.currentRoute.name}}
                  <i
                    class="material-icons"
                  >arrow_drop_down</i>
                </div>
              </template>
              <template v-slot:content>
                <button
                  v-if="isAuthenticated"
                  class="flex flex-row items-center justify-start focus:outline-none w-full py-3 px-2"
                >
                  <i class="material-icons mr-2">create</i> New Post
                </button>
                <button
                  v-if="isAuthenticated"
                  class="flex flex-row items-center justify-start focus:outline-none w-full py-3 px-2"
                >
                  <i class="material-icons mr-2">create</i> New Sub
                </button>
                <button
                  v-if="$router.currentRoute.name !== 'Home'"
                  class="flex flex-row items-center justify-start focus:outline-none w-full py-3 px-2"
                  @click="() =>{
                    $router.push('/');
                    close();
                    }"
                >
                  <i class="material-icons mr-2">home</i> Home
                </button>
              </template>
            </Collapse>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import DarkModeToggle from "@/components/DarkModeToggle.vue";
import Collapse from "@/components/Collapse.vue";

export default Vue.extend({
  name: "Sidebar",
  components: {
    DarkModeToggle,
    Collapse,
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
