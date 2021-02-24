import { MutationTree, ActionTree, Module } from "vuex";
import { RootState } from "..";

const state = () => ({
  points: {} as Record<string, boolean>,
  targetIDs: [] as Array<string>,
  isPointLoading: false,
  pointError: "",
});

export type PointState = ReturnType<typeof state>;

const actions: ActionTree<PointState, RootState> = {
  clearPointState: ({ commit }) => {
    commit("clearPointState");
  },
  getPoints: async ({ commit }, targetIDs) => {
    commit("startLoading");
    try {
      const res = await fetch(`/gql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
          query Input($targetIDs: [String]!) {
            points(targetIDs: $targetIDs)
          }
          `,
          variables: {
            targetIDs: targetIDs,
          },
        }),
      });

      const { errors, data } = await res.json();

      if (errors) throw Error(errors[0].message);

      commit("getPointsSuccess", JSON.parse(data.points));
    } catch (error) {
      console.log(error.message);
      commit("getPointsFail", error.message);
    }
    commit("endLoading");
  },
  incrementComment: async ({ commit }, id: string) => {
    try {
      const res = await fetch(`/gql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
          
          `,
        }),
      });

      const { errors, data } = await res.json();

      console.log(data);

      if (errors) throw Error(errors[0].message);

      // if (json.success) {
      //   commit("incrementCommentSuccess", json.data.point);
      //   commit("CommentState/updateCommentPoints", json.data.comment, {
      //     root: true,
      //   });
      // } else {
      //   commit("incrementCommentFail", json.message);
      // }
    } catch (error) {
      console.log(error);
      commit("incrementCommentFail", "Promise rejected with an error");
    }
  },
  decrementComment: async ({ commit }, id: string) => {
    try {
      const res = await fetch(
        `/api/v1/points/decrement/?type=comment&id=${id}`,
        {
          method: "POST",
        }
      );

      const json = await res.json();

      if (json.success) {
        commit("decrementCommentSuccess", json.data.point);
        commit("CommentState/updateCommentPoints", json.data.comment, {
          root: true,
        });
      } else {
        commit("decrementCommentFail", json.message);
      }
    } catch (error) {
      console.log(error);
      commit("decrementCommentFail", "Promise rejected with an error");
    }
  },
  incrementPost: async ({ commit }, id: string) => {
    try {
      const res = await fetch(`/gql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
          mutation Input($postID: String) {
            increment(postID: $postID) {
              post {
                _id
                points
              }
            }
          }`,
          variables: {
            postID: id,
          },
        }),
      });

      const { errors, data } = await res.json();

      if (errors) throw Error(errors[0].message);

      commit("incrementPostSuccess", data.increment.post);
      commit("PostState/updatePostPoints", data.increment.post.points, {
        root: true,
      });
      commit("SubState/updatePostPoints", data.increment.post, { root: true });
    } catch (error) {
      console.log(error);
      commit("incrementPostFail", error.message);
    }
  },
  decrementPost: async ({ commit }, postID: string) => {
    try {
      const res = await fetch(`/gql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
          mutation Input($postID: String) {
            decrement(postID: $postID) {
              post {
                _id
                points
              }
            }
          }`,
          variables: {
            postID: postID,
          },
        }),
      });

      const { errors, data } = await res.json();

      if (errors) throw Error(errors[0].message);

      commit("decrementPostSuccess", data.decrement.post);
      commit("PostState/updatePostPoints", data.decrement.post.points, {
        root: true,
      });
      commit("SubState/updatePostPoints", data.decrement.post, { root: true });
    } catch (error) {
      console.log(error);
      commit("decrementPostFail", error.message);
    }
  },
  removePostPoint: async ({ commit }, postID: string) => {
    try {
      const res = await fetch(`/gql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
          mutation Input($postID: String) {
            remove(postID: $postID) {
              post {
                _id
                points
              }
            }
          }`,
          variables: {
            postID: postID,
          },
        }),
      });

      const { errors, data } = await res.json();

      if (errors) throw Error(errors[0].message);

      commit("removePointSuccess", data.remove.post._id);
      commit("SubState/updatePostPoints", data.remove.post, { root: true });
      commit("PostState/updatePostPoints", data.remove.post.points, {
        root: true,
      });
    } catch (error) {
      console.log(error);
      commit("removePointFail", error.message);
    }
  },
};

const mutations: MutationTree<PointState> = {
  startLoading: (state) => (state.isPointLoading = true),
  endLoading: (state) => (state.isPointLoading = false),
  clearPointState: (state) => {
    state.points = {};
  },
  getPointsSuccess: (state, points) => {
    state.points = points;
  },
  getPointsFail: (state, error) => {
    state.pointError = error;
    setTimeout(() => (state.pointError = ""), 3000);
  },
  incrementCommentSuccess: (state, obj) => {
    state.points = { ...state.points, ...obj };
  },
  incrementCommentFail: (state, error) => {
    state.pointError = error;
    setTimeout(() => (state.pointError = ""), 3000);
  },
  decrementCommentSuccess: (state, obj) => {
    state.points = { ...state.points, ...obj };
  },
  decrementCommentFail: (state, error) => {
    state.pointError = error;
    setTimeout(() => (state.pointError = ""), 3000);
  },
  incrementPostSuccess: (state, obj) => {
    const id = obj._id;
    state.points = { ...state.points, [id]: true };
  },
  incrementPostFail: (state, error) => {
    state.pointError = error;
    setTimeout(() => (state.pointError = ""), 3000);
  },
  decrementPostSuccess: (state, obj) => {
    const id = obj._id;
    state.points = { ...state.points, [id]: false };
  },
  decrementPostFail: (state, error) => {
    state.pointError = error;
    setTimeout(() => (state.pointError = ""), 3000);
  },
  removePointSuccess: (state, targetId) => {
    delete state.points[targetId];
  },
  removePointFail: (state, error) => {
    state.pointError = error;
    setTimeout(() => (state.pointError = ""), 3000);
  },
  setTargetIDs: (state, arr) => {
    state.targetIDs = arr;
  },
  addToTargetIDs: (state, arr) => {
    state.targetIDs = [...state.targetIDs, ...arr];
  },
};

const module: Module<PointState, RootState> = {
  namespaced: true,
  state,
  actions,
  mutations,
};

export default module;
