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
        <div class="text-2xl font-thin">Theme</div>
        <div class="flex flex-wrap items-center justify-center">
          <div
            class="flex flex-col items-center justify-center bg-gray-100 p-2 border border-gray-400 dark:bg-transparent dark:border-gray-400 rounded"
          >
            <div>Light Theme Color</div>
            <div
              class="h-20 w-20"
              :style="`background-color: ${colorPrimaryLight};`"
            />
          </div>
          <div class="mx-8">
            <div class="text-center text-2xl font-thin">Primary</div>
            <div ref="colorPicker" />
          </div>
          <div
            class="flex flex-col items-center justify-center bg-gray-100 p-2 border border-gray-400 dark:bg-transparent dark:border-gray-400 rounded"
          >
            <div>Dark Theme Color</div>
            <div
              class="h-20 w-20"
              :style="`background-color: ${colorPrimaryDark};`"
            />
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
import { defineComponent } from "vue";
import Picker from "vanilla-picker";
import colorTransformer from "./util/colorTransform";

export default defineComponent({
  name: "CreateSub",
  components: {},
  data: function() {
    return {
      name: "",
      description: "",
      banner: "",
      icon: "",
      colorPrimary: "",
      colorPrimaryLight: "",
      colorPrimaryDark: "",
      picker: {} as Picker,
    };
  },
  methods: {
    handleCreate() {
      this.$store.direct.dispatch.DataMod.createSub({
        name: this.name,
        description: this.description,
        banner: this.banner,
        icon: this.icon,
        colorPrimary: this.colorPrimary,
        colorPrimaryLight: this.colorPrimaryLight,
        colorPrimaryDark: this.colorPrimaryDark,
      });
    },
    setColorPrimary(color: { hex: string }) {
      this.colorPrimary = color.hex;
      const l = colorTransformer.pSBC(0.5, color.hex, "", true);
      const d = colorTransformer.pSBC(-0.5, color.hex, "", true);
      if (l && d) {
        this.colorPrimaryLight = l;
        this.colorPrimaryDark = d;
      }
    },
  },
  mounted() {
    this.picker = new Picker({
      parent: this.$refs.colorPicker as HTMLElement,
      color: "gold",
      popup: false,
      alpha: false,
      onChange: this.setColorPrimary,
    });
  },
});
</script>
