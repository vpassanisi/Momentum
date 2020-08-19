import { MutationTree, ActionTree } from "vuex";
import router from "@/router/index";

interface NewPost {
  title: string;
  body: string;
}

interface CreatePostObj {
  subId: string;
  post: NewPost;
}

interface CreateCommentObj {
  postId: string;
  body: string;
  parent: string;
}

interface CreateReplyObj {
  postId: string;
  body: string;
  parentId: string;
  commentId: string;
}

interface Comment {
  _id: string;
  body: string;
  points: number;
  user: string;
  post: string;
  parent: string;
  createdatAt: number;
}

interface Post {
  _id: string;
  title: string;
  body: string;
  points: number;
  user: string;
  sub: string;
  createdAt: number;
}

interface Comments {
  [key: string]: Array<Comment>;
}

interface CurrentPostState {
  post: Post | null;
  comments: Comments;
  isPostLoading: boolean;
  postError: string | null;
}

const module = {
  namespaced: true,
  state: {
    post: null,
    comments: {},
    isPostLoading: false,
    postError: null,
  },
  actions: {
    getPostAndComments: async ({ commit }, post: string) => {
      commit("startLoading");
      try {
        const res = await fetch(
          `/api/v1/comments/?postID=${post}&sort=createdat&order=-1`,
          {
            method: "GET",
          }
        );

        const json = await res.json();

        if (json.success) {
          commit("getPostByIdSuccess", {
            post: json.data.post,
            comments: json.data.comments,
          });
        } else {
          commit("getPostByIdFail", json.message);
        }
      } catch (error) {
        commit("getPostByIdFail", "Promise rejected with error");
        console.error(error);
      }
      commit("endLoading");
    },
    createPost: async ({ commit }, obj: CreatePostObj) => {
      commit("startLoading");
      try {
        const res = await fetch(`/api/v1/posts/${obj.subId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(obj.post),
        });

        const json = await res.json();

        if (json.success) {
          router.push(
            `/s/${router.currentRoute.params.sub}/comments/${json.data._id}`
          );
        } else {
          commit("createPostFail", json.message);
        }
      } catch (error) {
        commit("createPostFail", "Promise rejected with an error");
        console.error(error);
      }
      commit("endLoading");
    },
    newCommentByPost: async ({ commit }, obj: CreateCommentObj) => {
      commit("startLoading");
      try {
        const res = await fetch(`/api/v1/comments/${obj.postId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            body: obj.body,
            parent: obj.parent,
          }),
        });

        const json = await res.json();

        if (json.success) {
          commit("newCommentSuccess", json.data);
        } else {
          commit("newCommentFail", json.message);
          console.log(json);
        }
      } catch (error) {
        commit("newCommentFail", "Promise rejected with an error");
        console.error(error);
      }
      commit("endLoading");
    },
    newReplyByPost: async ({ commit }, obj: CreateReplyObj) => {
      commit("startLoading");
      try {
        const res = await fetch(`/api/v1/replies/${obj.commentId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            body: obj.body,
            parent: obj.parentId,
            post: obj.postId,
          }),
        });

        const json = await res.json();

        if (json.success) {
          commit("newReplySuccess", json.data);
        } else {
          commit("newReplyFail", json.message);
          console.log(json);
        }
      } catch (error) {
        commit("newReplyFail", "Promise rejected with an error");
        console.error(error);
      }
      commit("endLoading");
    },
  } as ActionTree<CurrentPostState, null>,
  mutations: {
    startLoading: (state) => (state.isPostLoading = true),
    endLoading: (state) => (state.isPostLoading = false),
    getPostByIdSuccess: (state, { post, comments }) => {
      state.post = post;
      state.comments = comments;
    },
    getPostByIdFail: (state, error) => {
      state.postError = error;
      setTimeout(() => (state.postError = null), 3000);
    },
    newCommentSuccess: (state, comment: Comment) => {
      state.comments[comment._id] = [];

      state.comments[comment.parent] = [
        comment,
        ...state.comments[comment.parent],
      ];
    },
    newReplySuccess: (state, comment: Comment) => {
      state.comments[comment._id] = [];

      state.comments[comment.parent] = [
        comment,
        ...state.comments[comment.parent],
      ];
    },
    newCommentFail: (state, error) => {
      state.postError = error;
      setTimeout(() => (state.postError = null), 3000);
    },
    newReplyFail: (state, error) => {
      state.postError = error;
      setTimeout(() => (state.postError = null), 3000);
    },
    createPostFail: (state, error) => {
      state.postError = error;
      setTimeout(() => (state.postError = null), 3000);
    },
  } as MutationTree<CurrentPostState>,
};

export default module;
