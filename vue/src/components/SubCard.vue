<template>
  <div
    @click="$router.push(`/s/${sub.name}`)"
    class="flex flex-row mt-4 bg-white dark:bg-dark-gray-800 rounded shadow"
  >
    <div v-if="sub.icon === ''" class="w-1/6 flex items-center justify-center rounded bg-gray-50">
      <i class="material-icons text-6xl text-black">question_answer</i>
    </div>
    <div
      v-else
      :style="`background-image: url('${sub.icon}')`"
      class="w-1/6 bg-cover bg-center bg-no-repeat rounded"
      title="testing"
    />
    <div class="w-5/6 p-4">
      <div class="text-4xl font-thin">{{sub.name}}</div>
      <div>{{sub.description}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from "vue";

interface Sub {
  _id: string;
  name: string;
  description: string;
  founder: string;
  banner: string;
  createdatAt: number;
  colorPrimary: string;
  colorPrimaryLight: string;
  colorPrimaryDark: string;
}

export default defineComponent({
  name: "SubCard",
  props: {
    sub: Object as PropType<Sub>,
  },
});
</script>