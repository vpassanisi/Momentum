<template>
  <transition name="modal-bg-fade" @after-enter="showModal = true">
    <div
      class="fixed flex flex-col z-10 items-center justify-center top-0 bottom-0 left-0 right-0 h-full w-full bg-black bg-opacity-50"
      @click="close"
    >
      <transition name="modal-content-fade">
        <div
          v-if="showModal"
          class="flex flex-row rounded shadow w-90p max-w-screen-md bg-white dark:bg-dark-gray-900"
          :class="[mq === 'sm' || mq === 'md' ? '' : 'h-75vh']"
          @click="(e) => e.stopPropagation()"
        >
          <img
            class="h-full w-1/4 rounded-l"
            :class="[mq === 'sm' || mq === 'md' ? 'hidden' : '']"
            src="https://source.unsplash.com/collection/3330445/300x1800"
            alt
          />
          <div
            class="relative flex flex-col justify-center h-full w-full md:w-3/4 p-4"
            :class="[mq === 'sm' || mq === 'md' ? 'items-center' : '']"
          >
            <button class="absolute flex top-0 right-0 p-2 m-2 focus:outline-none" @click="close">
              <i class="material-icons">clear</i>
            </button>
            <div class="text-2xl">Log In</div>
            <MaterialInput
              class="shadow"
              :half="mq === 'sm' || mq === 'md' ? false : true"
              bordercolor="#BDBDBD"
              hoverBorderColor="#64B5F6"
              placeholder="email"
              :backgroundColor="isDarkMode ? '#121212' : '#ffffff'"
              :autofillColor="isDarkMode ? '#ffffff' : '#121212'"
              focusBorderColor="#1976D2"
              type="email"
              name="email"
              @input="handleEmailInput"
            />
            <MaterialInput
              class="shadow"
              :half="mq === 'sm' || mq === 'md' ? false : true"
              bordercolor="#BDBDBD"
              hoverBorderColor="#64B5F6"
              placeholder="pasword"
              :backgroundColor="isDarkMode ? '#121212' : '#ffffff'"
              focusBorderColor="#1976D2"
              type="password"
              name="password"
              @input="handlePasswordInput"
            />
            <button
              class="bg-blue-100 dark:bg-blue-700 rounded shadow text-sm py-2 focus:outline-none mt-4"
              :class="[mq === 'sm' || mq === 'md' ? 'w-full' : 'w-50p']"
              @click="handleLogin"
            >LOGIN</button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapState } from "vuex";
import MaterialInput from "./MaterialInput.vue";

export default Vue.extend({
  name: "LoginModal",
  components: {
    MaterialInput,
  },
  data: function () {
    return {
      email: "",
      password: "",
      showModal: false,
    };
  },
  computed: {
    ...mapState("AuthState", ["isAuthenticated"]),
    ...mapState("MediaQueryState", ["mq"]),
    ...mapState("DarkMode", ["isDarkMode"]),
  },
  methods: {
    ...mapActions("AuthState", ["login"]),
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
    handleKeyDown(e: KeyboardEvent) {
      if (e.code === "Enter") {
        this.handleLogin();
      }
    },
    handleEmailInput(value: string) {
      this.email = value;
    },
    handlePasswordInput(value: string) {
      this.password = value;
    },
  },
  watch: {
    isAuthenticated: function () {
      this.$emit("closeModal");
    },
  },
});
</script>

<style scoped></style>
