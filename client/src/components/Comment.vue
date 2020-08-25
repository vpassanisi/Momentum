<template>
  <div v-if="isOpen" class="flex flex-row py-4">
    <div class="flex flex-col w-6">
      <button
        class="w-full focus:outline-none py-2"
        :class="[
          isActive !== null && isActive
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
          isActive !== null && !isActive
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
      <editor-content :editor="readOnlyEditor" />
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
    <span class="text-sm text-gray-500 flex items-center justify-center">{{
      `${comment.user.name} • ${comment.points} Points • ${formatedTime}`
    }}</span>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { mapState, mapActions } from "vuex";
import Comment from "./Comment.vue";
import NewCommentEditor from "./NewCommentEditor.vue";
import { Editor, EditorContent } from "tiptap";
import {
  Bold,
  Italic,
  Strike,
  Underline,
  Code,
  Heading,
  Blockquote,
  CodeBlock,
  HorizontalRule,
} from "tiptap-extensions";

interface Comment {
  _id: string;
  body: string;
  points: number;
  user: string;
  post: string;
  parent: string;
  children: Array<Comment>;
  createdAt: number;
}

export default Vue.extend({
  name: "Comment",
  components: {
    EditorContent,
    NewCommentEditor,
  },
  props: {
    comment: Object as PropType<Comment>,
    rootId: String,
  },
  data() {
    return {
      isActive: null as null | boolean,
      formatedTime: null,
      isReplyOpen: false,
      isOpen: true,
      readOnlyEditor: new Editor({
        editable: false,
        editorProps: {
          attributes: {
            class: "p-4 position-inherit focus:outline-none",
          },
        },
        extensions: [
          new Bold(),
          new Italic(),
          new Strike(),
          new Underline(),
          new Code(),
          new Heading({ levels: [1, 2, 3] }),
          new Blockquote(),
          new CodeBlock(),
          new HorizontalRule(),
        ],
      }),
    };
  },
  computed: {
    ...mapState("AuthState", ["isAuthenticated"]),
    ...mapState("PointState", ["points"]),
    ...mapState("CommentState", ["comments"]),
  },
  methods: {
    ...mapActions("EventState", ["getTimeSince"]),
    ...mapActions("PointState", [
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
    handleUp() {
      if (this.isActive === null || this.isActive === false) {
        this.incrementComment(this.comment._id);
        this.isActive = true;
      } else {
        this.removePoint(this.comment._id);
        this.isActive = null;
      }
    },
    handleDown() {
      if (this.isActive === null || this.isActive === true) {
        this.decrementComment(this.comment._id);
        this.isActive = false;
      } else {
        this.removePoint(this.comment._id);
        this.isActive = null;
      }
    },
  },
  mounted: async function() {
    this.readOnlyEditor.setContent(JSON.parse(this.comment.body));

    this.formatedTime = await this.getTimeSince(this.comment.createdAt);

    if (this.points[this.comment._id] !== undefined) {
      this.isActive = this.points[this.comment._id];
    }
  },
  watch: {
    points: function() {
      if (this.points[this.comment._id] !== undefined) {
        this.isActive = this.points[this.comment._id];
      } else {
        this.points[this.comment._id] = null;
      }
    },
  },
});
</script>
