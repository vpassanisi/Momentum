<template>
  <div class="bg-white">{{comment.body}}</div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

interface Comment {
  _id: string;
  body: string;
  points: number;
  user: string;
  post: string;
  createdAt: number;
}

export default Vue.extend({
  name: "Comment",
  props: {
    comment: Object as PropType<Comment>,
  },
});
</script>