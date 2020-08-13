import { MutationTree, ActionTree } from "vuex";

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
  comment: string;
}

interface Comment {
  _id: string;
  body: string;
  points: number;
  user: string;
  post: string;
  createdatAt: number;
}

interface Post {
  _id: string;
  title: string;
  body: string;
  user: string;
  sub: string;
  createdAt: number;
}

interface CurrentPostState {
  post: Post | null;
  comments: Array<Comment>;
  isLoading: boolean;
  error: string | null;
}

const module = {
  namespaced: true,
  state: {
    post: null,
    comments: [],
    isLoading: false,
    error: null,
  },
  actions: {
    getPostById: async ({ commit }, post: string) => {
      commit("startLoading");
      try {
        const res = await fetch(`/api/v1/comments/${post}`, {
          method: "GET",
        });

        const json = await res.json();

        if (json.success) {
          commit("setPost", json.data.post);
          json.data.comments.forEach((val: Comment, i: number) => {
            val.body = JSON.parse(val.body);
            json.data.comments[i] = val;
          });
          commit("setComments", json.data.comments);
        }
      } catch (error) {
        console.log(error);
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

        console.log(json);
      } catch (error) {
        console.log(error);
      }
      commit("endLoading");
    },
    newCommentByPost: async ({ commit }, obj: CreateCommentObj) => {
      commit("startLoading");
      try {
        const res = await fetch(`/api/v1/comments/${obj.postId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body: obj.comment }),
        });

        const json = await res.json();

        if (json.success) {
          commit("newCommentSuccess", JSON.parse(json.data));
        } else {
          commit("newCommentFail", "something went wrong");
          console.log(json);
        }
      } catch (error) {
        console.log(error);
      }
    },
  } as ActionTree<CurrentPostState, null>,
  mutations: {
    startLoading: (state) => (state.isLoading = true),
    endLoading: (state) => (state.isLoading = false),
    setComments: (state, comments) => (state.comments = comments),
    setPost: (state, post) => (state.post = post),
    newCommentSuccess: (state, comment) =>
      (state.comments = [comment, ...state.comments]),
    newCommentFail: (state, error) => (state.error = error),
  } as MutationTree<CurrentPostState>,
};

export default module;
