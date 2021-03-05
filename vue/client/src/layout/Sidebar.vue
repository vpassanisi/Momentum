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
            class="flex items-center justify-center h-20 border-b broder-gray-400 dark:border-gray-700 w-full py-2"
          >
            <DarkModeToggle />
          </div>
          <div class="flex flex-col h-full w-full">
            <button
              v-if="isAuthenticated"
              class="flex flex-row items-center justify-start focus:outline-none py-3 px-2 border-b border-gray-300 dark:border-gray-600"
              @click="logout"
            >
              LOG OUT
            </button>
            <button
              v-if="!isAuthenticated"
              class="flex flex-row items-center justify-start focus:outline-none py-3 px-2 border-b border-gray-300 dark:border-gray-600"
              @click="openLoginModal"
            >
              LOG IN
            </button>
            <button
              v-if="!isAuthenticated"
              class="flex flex-row items-center justify-start focus:outline-none py-3 px-2 border-b border-gray-300 dark:border-gray-600"
              @click="openRegisterModal"
            >
              SIGN UP
            </button>
            <Collapse>
              <template v-slot:main>
                <div
                  class="flex flex-row items-center justify-between focus:outline-none py-3 px-2"
                >
                  {{ $route.params.sub ? $route.params.sub : $route.name }}
                  <i class="material-icons">arrow_drop_down</i>
                </div>
              </template>
              <template v-slot:content>
                <router-link
                  v-if="
                    isAuthenticated &&
                      $route.name !== 'Create Post' &&
                      $route.params.sub
                  "
                  class="flex flex-row items-center justify-start no-underline w-full py-3 px-2"
                  @click="close"
                  :to="{ path: `/s/${$route.params.sub}/create` }"
                >
                  <i class="material-icons mr-2">create</i> Create Post
                </router-link>
                <router-link
                  v-if="isAuthenticated && $route.name !== 'Create Sub'"
                  class="flex flex-row items-center justify-start no-underline w-full py-3 px-2"
                  @click="close"
                  :to="{ path: `/subs/create` }"
                >
                  <i class="material-icons mr-2">create</i> Create Sub
                </router-link>
                <button
                  v-if="$route.name !== 'Home'"
                  class="flex flex-row items-center justify-start focus:outline-none w-full py-3 px-2"
                  @click="
                    () => {
                      $router.push('/');
                      close();
                    }
                  "
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
import { defineComponent } from "vue";
import DarkModeToggle from "../components/DarkModeToggle.vue";
import Collapse from "../components/Collapse.vue";

export default defineComponent({
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
    isAuthenticated(): boolean {
      return this.$store.direct.state.AuthMod.isAuthenticated;
    },
    sidebar(): boolean {
      return this.$store.direct.state.EventMod.sidebar;
    },
  },
  methods: {
    close() {
      this.showSidebar = false;
      this.$store.direct.commit.closeSidebar();
    },
    openLoginModal() {
      this.$store.direct.commit.openLoginModal();
      this.close();
    },
    openRegisterModal() {
      this.$store.direct.commit.openRegisterModal();
      this.close();
    },
    logout() {
      this.$store.direct.dispatch.logout();
      this.close();
    },
  },
});
</script>
