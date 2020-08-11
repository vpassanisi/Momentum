<template>
  <transition name="modal-fade">
    <div
      class="fixed flex flex-col z-10 items-center justify-center top-0 bottom-0 left-0 right-0 h-full w-full bg-black bg-opacity-50"
      @click="close"
    >
      <div
        class="flex flex-row rounded shadow w-90p max-w-screen-md bg-white dark:bg-dark-gray-900"
        :class="[$mq === 'sm' || $mq === 'md' ? '' : 'h-75vh']"
        @click="(e) => e.stopPropagation()"
      >
        <img
          class="h-full w-1/4 rounded-l"
          :class="[$mq === 'sm' || $mq === 'md' ? 'hidden' : '']"
          src="https://source.unsplash.com/collection/3330445"
          alt=""
        />
        <div
          class="relative flex flex-col justify-center h-full w-full md:w-3/4 p-4"
          :class="[$mq === 'sm' || $mq === 'md' ? 'items-center' : '']"
        >
          <button
            class="absolute flex top-0 right-0 p-2 m-2 focus:outline-none"
            @click="close"
          >
            <i class="material-icons">clear</i>
          </button>
          <div class="text-2xl mb-4">Log In</div>
          <input
            class="border border-gray-400 bg-transparent rounded p-2 mb-2 focus:outline-none"
            :class="[$mq === 'sm' || $mq === 'md' ? 'w-full' : 'w-50p']"
            @keydown="handleKeyDown"
            v-model="email"
            placeholder="email"
            type="email"
            name="email"
          />
          <input
            class="border border-gray-400 bg-transparent rounded p-2 mb-2 focus:outline-none"
            :class="[$mq === 'sm' || $mq === 'md' ? 'w-full' : 'w-50p']"
            @keydown="handleKeyDown"
            v-model="password"
            placeholder="password"
            type="password"
            name="password"
          />
          <button
            class="bg-blue-100 dark:bg-blue-700 rounded shadow text-sm py-2 focus:outline-none"
            :class="[$mq === 'sm' || $mq === 'md' ? 'w-full' : 'w-50p']"
            @click="handleLogin"
          >
            LOGIN
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapState } from "vuex";

// TODO: login form
export default Vue.extend({
  name: "LoginModal",
  data: function() {
    return {
      email: "",
      password: "",
    };
  },
  computed: {
    ...mapState("AuthState", ["isAuthenticated"]),
  },
  methods: {
    ...mapActions("AuthState", ["login"]),
    close() {
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
  },
  watch: {
    isAuthenticated: function() {
      this.$emit("closeModal");
    },
  },
});
</script>
