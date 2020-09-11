<template>
  <section class="flex flex-row min-h-screen">
    <div
      class="w-1/6 bg-cover bg-center bg-no-repeat"
      style="background-image: url('https://source.unsplash.com/collection/3330445/300x1800')"
    />
    <div class="w-full md:w-4/6 pt-24 px-8">
      <div class="text-4xl font-thin">Create a sub</div>
      <hr />
      <div class="p-4 shadow bg-white dark:bg-dark-gray-800 rounded mt-8">
        <div class="text-2xl font-thin">Name</div>
        <div class="text-gray-600 dark:text-gray-500">
          A subs name, including capitalization, cannot be changed
        </div>
        <input
          type="text"
          class="w-full rounded border border-gray-900 dark:border-gray-300 focus:border-blue-500 bg-transparent mt-4 p-2 focus:outline-none transition-borderColor duration-300 ease-in-out"
          name="name"
          v-model="name"
        />
      </div>
      <div class="p-4 shadow bg-white dark:bg-dark-gray-800 rounded mt-8">
        <div class="text-2xl font-thin">Description</div>
        <div class="text-gray-600 dark:text-gray-500">
          This is how new members come to understand your community.
        </div>
        <textarea
          name="description"
          cols="30"
          class="w-full mt-4 rounded border border-gray-900 dark:border-gray-300 focus:border-blue-500 bg-transparent p-2 focus:outline-none transition-borderColor duration-300 ease-in-out"
          v-model="description"
        ></textarea>
      </div>
      <div class="p-4 shadow bg-white dark:bg-dark-gray-800 rounded mt-8">
        <div class="text-2xl font-thin">Banner URL</div>
        <input
          type="text"
          class="w-full rounded border border-gray-900 dark:border-gray-300 focus:border-blue-500 bg-transparent mt-4 p-2 focus:outline-none transition-borderColor duration-300 ease-in-out"
          name="banner"
          v-model="banner"
        />
      </div>
      <div class="p-4 shadow bg-white dark:bg-dark-gray-800 rounded mt-8">
        <div class="text-2xl font-thin">Icon URL</div>
        <input
          type="text"
          class="w-full rounded border border-gray-900 dark:border-gray-300 focus:border-blue-500 bg-transparent mt-4 p-2 focus:outline-none transition-borderColor duration-300 ease-in-out"
          name="icon"
          v-model="icon"
        />
      </div>
      <div class="p-4 shadow bg-white dark:bg-dark-gray-800 rounded mt-8">
        <div class="text-2xl font-thin mt-8">Theme</div>
        <div class="flex flex-wrap">
          <div class="mr-4">
            <div class="text-2xl font-thin">Color: Primary-Light</div>
            <chrome-picker v-model="primaryLight" />
          </div>
          <div class="mr-4">
            <div class="text-2xl font-thin">Color: Primary</div>
            <chrome-picker v-model="primary" />
          </div>
          <div>
            <div class="text-2xl font-thin">Color: Primary-Dark</div>
            <chrome-picker v-model="primaryDark" />
          </div>
        </div>
      </div>
      <div class="flex flex-row justify-end my-8">
        <button
          class="w-40 rounded bg-blue-500 text-white py-2 text-xl focus:outline-none shadow"
          @click="handleCreate"
        >
          Create
        </button>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Chrome } from "vue-color";
import { mapActions } from "vuex";

export default Vue.extend({
  name: "CreateSub",
  components: {
    "chrome-picker": Chrome,
  },
  data: function() {
    return {
      name: "",
      description: "",
      banner: "",
      icon: "",
      primary: {
        hex: "#ffffff",
      },
      primaryLight: {
        hex: "#ffffff",
      },
      primaryDark: {
        hex: "#ffffff",
      },
    };
  },
  methods: {
    ...mapActions("SubState", ["createSub"]),
    handleCreate() {
      this.createSub({
        name: this.name,
        description: this.description,
        banner: this.banner,
        icon: this.icon,
        colorPrimary: this.primary.hex,
        colorPrimaryLight: this.primaryLight.hex,
        colorPrimaryDark: this.primaryDark.hex,
      });
    },
  },
});
</script>
