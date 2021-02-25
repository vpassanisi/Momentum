<template>
  <div v-if="isOpen" class="flex flex-row py-4 w-full">
    <div class="flex flex-col w-6">
      <button
        class="w-full focus:outline-none py-2"
        :class="[
          isActive === true
            ? 'text-green-600 dark:text-green-500'
            : 'text-gray-900 dark:text-gray-400',
        ]"
        @click="handleUp"
      >
        <svg
          viewBox="100 14.653 300 168.661"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M 379.784 183.315 L 120.215 183.315 C 102.241 183.315 93.24 161.772 105.949 149.173 L 235.734 20.511 C 243.613 12.701 256.387 12.701 264.265 20.511 L 394.05 149.173 C 406.76 161.772 397.758 183.315 379.784 183.315 Z"
            class
            style
          />
        </svg>
      </button>
      <button
        class="w-full focus:outline-none py-2"
        :class="[
          isActive === false
            ? 'text-red-600 dark:text-red-500'
            : 'text-gray-900 dark:text-gray-400',
        ]"
        @click="handleDown"
      >
        <svg viewBox="100 14.112 300 168.65" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="currentColor"
            d="M 120.186 14.112 L 379.814 14.112 C 397.775 14.112 406.756 35.612 394.042 48.212 L 264.278 176.912 C 256.408 184.712 243.593 184.712 235.722 176.912 L 105.958 48.212 C 93.244 35.612 102.225 14.112 120.186 14.112 Z"
            class
            style
          />
        </svg>
      </button>
      <div
        class="border-r-2 border-gray-300 dark:border-gray-700 hover:border-gray-700 dark:hover:border-gray-300 w-50p h-full self-start cursor-pointer"
        @click="close"
      />
    </div>
    <div class="w-full">
      <span class="pl-4 text-sm text-gray-500">
        {{
          `${comment.user.name} • ${comment.points} Points • ${formatedTime} ago`
        }}
      </span>
      <quill-editor :value="comment.body" :readOnly="true" :theme="'bubble'" />
      <div v-if="isAuthenticated">
        <div v-if="isReplyOpen" class="flex flex-row">
          <div class="flex flex-col min-w-6">
            <div
              class="border-r-2 border-gray-300 dark:border-gray-700 w-50p h-full self-start"
            />
          </div>
          <NewCommentEditor
            :postId="comment.post"
            :parentId="comment._id"
            :rootId="rootId"
            :closeButton="true"
            @close="closeReply"
          />
        </div>
        <span v-else>
          <button
            class="flex items-center dark:hover:bg-gray-600 hover:bg-gray-200 rounded p-1 text-gray-500 text-sm focus:outline-none"
            @click="openReply"
          >
            <i class="material-icons text-sm mr-2">chat_bubble</i> Reply
          </button>
        </span>
      </div>
      <div v-if="comments[comment._id].length > 0">
        <Comment
          v-for="com in comments[comment._id]"
          :key="com._id"
          :comment="com"
          :rootId="rootId"
        />
      </div>
    </div>
  </div>
  <div v-else class="flex flex-row items-center justify-start py-4">
    <button @click="open" class="flex pr-3">
      <i class="material-icons text-blue-700 dark:text-blue-100 text-3xl"
        >add_circle</i
      >
    </button>
    <span class="text-sm text-gray-500 flex items-center justify-center">
      {{
        `${comment.user.name} • ${comment.points} Points • ${formatedTime} ago`
      }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { mapActions } from "vuex";
import type {Comment} from "../store/modules/CommentState"
import NewCommentEditor from "./NewCommentEditor.vue";
import QuillEditor from "./QuillEditor.vue";

export default defineComponent({
  name: "Comment",
  components: {
    NewCommentEditor,
    QuillEditor
  },
  props: {
    comment: {
      type: Object as PropType<Comment>,
      required: true,
    },
    rootId: String,
  },
  data() {
    return {
      isActive: undefined as undefined | boolean,
      formatedTime: null,
      isReplyOpen: false,
      isOpen: true,
    };
  },
  computed: {
    isAuthenticated(): boolean {
      return this.$store.state.AuthState.isAuthenticated
    },
    targetIDs(): string[] {
      return this.$store.state.PointState.targetIDs
    },
    points(): Record<string, boolean> {
      return this.$store.state.PointState.points
    },
    comments(): Record<string, Comment[]> {
      return this.$store.state.CommentState.comments
    }
  },
  methods: {
    ...mapActions("EventState", ["getTimeSince"]),
    ...mapActions("PointState", [
      "getPoints",
      "incrementComment",
      "decrementComment",
      "removePoint",
    ]),
    close() {
      this.isOpen = false;
    },
    open() {
      this.isOpen = true;
    },
    openReply() {
      this.isReplyOpen = true;
    },
    closeReply() {
      this.isReplyOpen = false;
    },
    async handleUp() {
      if (!this.isAuthenticated) return;
      if (this.isActive === true) {
        this.isActive = undefined;
        await this.removePoint({ targetId: this.comment._id, type: "comment" });
        } else {
        this.isActive = true;
        await this.incrementComment(this.comment._id);
      }
    },
    async handleDown() {
      if (!this.isAuthenticated) return;
      if (this.isActive === false) {
        this.isActive = undefined;
        await this.removePoint({ targetId: this.comment._id, type: "comment" });
      } else {
        this.isActive = false;
        await this.decrementComment(this.comment._id);
      }
    },
  },
  mounted: async function() {
    this.formatedTime = await this.getTimeSince(this.comment.createdAt);

    this.isActive = this.points[this.comment._id];
  },
  watch: {
    points: function() {
      this.isActive = this.points[this.comment._id];
    },
  },
});
</script>
