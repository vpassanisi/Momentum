<template>
  <transition name="modal-bg-fade" @after-enter="showModal = true">
    <div
      class="fixed flex flex-col z-10 items-center justify-center top-0 bottom-0 left-0 right-0 h-full w-full bg-black bg-opacity-50"
      @click="close"
    >
      <transition name="modal-content-fade">
        <div
          v-if="showModal"
          class="flex flex-row rounded shadow w-90p max-w-screen-md bg-white dark:bg-dark-gray-900 border border-gray-400 dark:border-gray-700 md:h-3/4"
          @click="(e) => e.stopPropagation()"
        >
          <img
            class="h-full w-1/4 rounded-l hidden md:inline-block"
            src="https://source.unsplash.com/collection/3330445/300x1800"
            alt
          />
          <div
            class="relative flex flex-col itmes-center md:items-start justify-center h-full w-full md:w-3/4 p-4"
          >
            <button
              class="absolute flex top-0 right-0 p-2 m-2 focus:outline-none"
              @click="close"
            >
              <i class="material-icons">clear</i>
            </button>
            <div class="text-2xl">Log In</div>
            <MaterialInput
              class="shadow"
              borderClr="#BDBDBD"
              hoverBorderColor="#64B5F6"
              placeholder="email"
              :backgroundColor="isDarkMode ? '#121212' : '#ffffff'"
              :autofillColor="isDarkMode ? '#ffffff' : '#121212'"
              focusBorderColor="#1976D2"
              type="email"
              name="email"
              @input="handleEmailInput($event.target?.value)"
              @enter="handleLogin"
            />
            <MaterialInput
              class="shadow"
              borderClr="#BDBDBD"
              hoverBorderColor="#64B5F6"
              placeholder="pasword"
              :backgroundColor="isDarkMode ? '#121212' : '#ffffff'"
              :autofillColor="isDarkMode ? '#ffffff' : '#121212'"
              focusBorderColor="#1976D2"
              type="password"
              name="password"
              @input="handlePasswordInput($event.target?.value)"
              @enter="handleLogin"
            />
            <button
              class="bg-blue-100 dark:bg-blue-700 rounded shadow text-sm py-2 focus:outline-none mt-4 w-full md:w-1/2"
              @click="handleLogin"
            >
              LOGIN
            </button>
            <div class="text-center w-full md:w-1/2 mt-2">or</div>
            <a
              class="mt-2 text-center w-full md:w-1/2 cursor-pointer text-blue-500 dark:text-blue-400"
              @click="handleDemoLogin"
              >Use Demo Account</a
            >
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MaterialInput from "./MaterialInput.vue";

export default defineComponent({
  name: "LoginModal",
  components: {
    MaterialInput,
  },
  data: function() {
    return {
      email: "",
      password: "",
      showModal: false,
    };
  },
  computed: {
    isAuthenticated(): boolean {
      return this.$store.state.AuthState.isAuthenticated;
    },
    isDarkMode(): boolean {
      return this.$store.state.DarkModeState.isDarkMode;
    },
  },
  methods: {
    login(x: object) {
      this.$store.dispatch("AuthState/login", x);
    },
    close() {
      this.showModal = false;
      this.$emit("closeModal", false);
    },
    handleLogin() {
      this.login({
        email: this.email,
        password: this.password,
      });
    },
    handleDemoLogin() {
      this.login({
        email: "Demo@gmail.com",
        password: "123456",
      });
    },
    handleKeyDown(e: KeyboardEvent) {
      if (e.code === "Enter") {
        this.handleLogin();
      }
    },
    handleEmailInput(v: string) {
      this.email = v;
    },
    handlePasswordInput(v: string) {
      this.password = v;
    },
  },
  watch: {
    isAuthenticated: function() {
      this.$emit("closeModal");
    },
  },
});
</script>
