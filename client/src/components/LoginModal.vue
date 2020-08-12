<template>
  <transition name="modal-fade">
    <div
      class="fixed flex flex-col z-10 items-center justify-center top-0 bottom-0 left-0 right-0 h-full w-full bg-black bg-opacity-50"
      @click="close"
    >
      <div
        class="flex flex-row rounded shadow w-90p max-w-screen-md bg-white dark:bg-dark-gray-900"
        :class="[mq === 'sm' || mq === 'md' ? '' : 'h-75vh']"
        @click="(e) => e.stopPropagation()"
      >
        <img
          class="h-full w-1/4 rounded-l"
          :class="[mq === 'sm' || mq === 'md' ? 'hidden' : '']"
          src="https://source.unsplash.com/collection/3330445/300x1800"
          alt=""
        />
        <div
          class="relative flex flex-col justify-center h-full w-full md:w-3/4 p-4"
          :class="[mq === 'sm' || mq === 'md' ? 'items-center' : '']"
        >
          <button
            class="absolute flex top-0 right-0 p-2 m-2 focus:outline-none"
            @click="close"
          >
            <i class="material-icons">clear</i>
          </button>
          <div class="text-2xl mb-4">Log In</div>
          <!-- <div
            class="relative"
            :class="[mq === 'sm' || mq === 'md' ? 'w-full' : 'w-50p']"
          >
            <input
              id="email-input"
              class="relative border border-gray-400 bg-transparent dark:bg-dark-gray-900 focus:border-blue-700 hover:border-blue-300 transition-colors duration-300 ease-in-out rounded p-2 focus:outline-none w-full"
              @keydown="handleKeyDown"
              v-model="email"
              placeholder=" "
              type="email"
              name="email"
            /><label
              id="email-label"
              class="block absolute bg-white dark:bg-dark-gray-900 text-gray-500"
              >email</label
            >
          </div>
          <div
            class="relative mt-4"
            :class="[mq === 'sm' || mq === 'md' ? 'w-full' : 'w-50p']"
          >
            <input
              id="password-input"
              class="relative border border-gray-400 bg-transparent dark:bg-dark-gray-900 focus:border-blue-700 hover:border-blue-300 transition-colors duration-300 ease-in-out rounded p-2 focus:outline-none w-full"
              @keydown="handleKeyDown"
              v-model="password"
              placeholder=" "
              type="password"
              name="password"
            /><label
              id="password-label"
              class="block absolute bg-white dark:bg-dark-gray-900 text-gray-500"
              >password</label
            >
          </div> -->
          <MaterialInput
            :half="mq === 'sm' || mq === 'md' ? false : true"
            borderColor="#BDBDBD"
            hoverBorderColor="#64B5F6"
            placeholder="email"
            :backgroundColor="isDarkMode ? '#121212' : '#ffffff'"
            focusBorderColor="#1976D2"
            type="email"
            @input="handleEmailInput"
          />
          <MaterialInput
            :half="mq === 'sm' || mq === 'md' ? false : true"
            borderColor="#BDBDBD"
            hoverBorderColor="#64B5F6"
            placeholder="pasword"
            :backgroundColor="isDarkMode ? '#121212' : '#ffffff'"
            focusBorderColor="#1976D2"
            type="password"
            @input="handlePasswordInput"
          />
          <button
            class="bg-blue-100 dark:bg-blue-700 rounded shadow text-sm py-2 focus:outline-none mt-2"
            :class="[mq === 'sm' || mq === 'md' ? 'w-full' : 'w-50p']"
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
import MaterialInput from "./MaterialInput.vue";

// TODO: login form
export default Vue.extend({
  name: "LoginModal",
  components: {
    MaterialInput,
  },
  data: function() {
    return {
      email: "",
      password: "",
      testing: "",
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
    isAuthenticated: function() {
      this.$emit("closeModal");
    },
  },
});
</script>

<style scoped>
#email-label,
#password-label {
  top: 0.5rem;
  left: 0.5rem;
  transition: transform 0.1s ease-in-out;
}

#password-input:not(:placeholder-shown) ~ #password-label,
#password-input:focus ~ #password-label {
  transform: translateY(-85%) scale(0.85);
}

#email-input:not(:placeholder-shown) ~ #email-label,
#email-input:focus ~ #email-label {
  transform: translateY(-85%) scale(0.85);
}
</style>
