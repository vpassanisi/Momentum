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
  parent: string;
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
  isLoading: boolean;
  error: string | null;
}

const module = {
  namespaced: true,
  state: {
    post: null,
    comments: {},
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
          body: JSON.stringify({ body: obj.comment, parent: obj.parent }),
        });

        const json = await res.json();

        if (json.success) {
          commit("newCommentSuccess", json.data);
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
    newCommentSuccess: (state, comment: Comment) => {
      state.comments[comment._id] = [];

      state.comments[comment.parent] = [
        comment,
        ...state.comments[comment.parent],
      ];
    },
    newCommentFail: (state, error) => (state.error = error),
  } as MutationTree<CurrentPostState>,
};

export default module;
