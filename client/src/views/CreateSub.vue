<template>
  <section class="flex flex-row min-h-screen">
    <div
      class="w-1/6 bg-cover bg-center bg-no-repeat"
      style="background-image: url('https://source.unsplash.com/collection/3330445/300x1800')"
    />
    <div class="w-full md:w-4/6 pt-24 px-8">
      <div class="text-4xl font-thin">Create a sub</div>
      <hr />
      <div class="text-2xl font-thin mt-4">Name</div>
      <div class="text-gray-600 dark:text-gray-500">
        A subs name, including capitalization, cannot be changed
      </div>
      <input
        type="name"
        class="w-full rounded border border-gray-900 dark:border-gray-300 focus:border-blue-500 bg-transparent mt-4 p-2 focus:outline-none transition-borderColor duration-300 ease-in-out"
      />
      <div class="text-2xl font-thin mt-8">Description</div>
      <div class="text-gray-600 dark:text-gray-500">
        This is how new members come to understand your community.
      </div>
      <textarea
        name="description"
        cols="30"
        class="w-full mt-4 rounded border border-gray-900 dark:border-gray-300 focus:border-blue-500 bg-transparent p-2 focus:outline-none transition-borderColor duration-300 ease-in-out"
      ></textarea>
      <div class="flex flex-wrap">
        <div class="mr-4">
          <div class="text-2xl font-thin mt-8">Color: Primary-Light</div>
          <chrome-picker v-model="primaryLight" />
        </div>
        <div class="mr-4">
          <div class="text-2xl font-thin mt-8">Color: Primary</div>
          <chrome-picker v-model="primary" />
        </div>
        <div>
          <div class="text-2xl font-thin mt-8">Color: Primary-Dark</div>
          <chrome-picker v-model="primaryDark" />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Chrome } from "vue-color";
export default Vue.extend({
  name: "CreateSub",
  components: {
    "chrome-picker": Chrome,
  },
  data: function() {
    return {
      primary: "#ffffff",
      primaryLight: "#ffffff",
      primaryDark: "#ffffff",
    };
  },
});
</script>
