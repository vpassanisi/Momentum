import { MutationTree, ActionTree, Module } from "vuex";
import { RootState } from "..";

const state = () => ({
  points: {} as Record<string, boolean>,
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

      console.log(JSON.parse(data.points));

      if (errors) throw Error(errors[0].message);

      if (!res.ok) throw Error(await res.text());

      commit("getPointsSuccess", JSON.parse(data.points));
    } catch (error) {
      console.log(error.message);
      commit("getPointsFail", error.message);
    }
    commit("endLoading");
  },
  incrementComment: async ({ commit }, id: string) => {
    try {
      const res = await fetch(
        `/api/v1/points/increment/?type=comment&id=${id}`,
        {
          method: "POST",
        }
      );

      const json = await res.json();

      if (json.success) {
        commit("incrementCommentSuccess", json.data.point);
        commit("CommentState/updateCommentPoints", json.data.comment, {
          root: true,
        });
      } else {
        commit("incrementCommentFail", json.message);
      }
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
      const res = await fetch(`/api/v1/points/increment/?type=post&id=${id}`, {
        method: "POST",
      });

      const json = await res.json();

      if (json.success) {
        commit("incrementPostSuccess", json.data.point);
        commit("PostState/updatePostPoints", json.data.post, { root: true });
        commit("SubState/updatePostPoints", json.data.post, { root: true });
      } else {
        commit("incrementPostFail", json.message);
      }
    } catch (error) {
      console.log(error);
      commit("incrementPostFail", "Promise rejected with an error");
    }
  },
  decrementPost: async ({ commit }, id: string) => {
    try {
      const res = await fetch(`/api/v1/points/decrement/?type=post&id=${id}`, {
        method: "POST",
      });

      const json = await res.json();

      if (json.success) {
        commit("decrementPostSuccess", json.data.point);
        commit("PostState/updatePostPoints", json.data.post, { root: true });
        commit("SubState/updatePostPoints", json.data.post, { root: true });
      } else {
        commit("decrementPostFail", json.message);
      }
    } catch (error) {
      console.log(error);
      commit("decrementPostFail", "Promise rejected with an error");
    }
  },
  removePoint: async ({ commit }, { targetId, type }) => {
    try {
      const res = await fetch(`/api/v1/points/${type}/${targetId}`, {
        method: "DELETE",
      });

      const json = await res.json();

      if (json.success) {
        commit("removePointSuccess", targetId);
        if (type === "comment") {
          commit("CommentState/updateCommentPoints", json.data, {
            root: true,
          });
        }
        if (type === "post") {
          commit("PostState/updatePostPoints", json.data, {
            root: true,
          });
          commit("SubState/updatePostPoints", json.data, { root: true });
        }
      } else {
        commit("removePointFail", json.message);
      }
    } catch (error) {
      console.log(error);
      commit("removePointFail", "Promise rejected with an error");
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
    state.points = { ...state.points, ...obj };
  },
  incrementPostFail: (state, error) => {
    state.pointError = error;
    setTimeout(() => (state.pointError = ""), 3000);
  },
  decrementPostSuccess: (state, obj) => {
    state.points = { ...state.points, ...obj };
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
  // setTargetIds: (state, arr) => {},
  // addToTargetIds: (state, arr) => {},
};

const module: Module<PointState, RootState> = {
  namespaced: true,
  state,
  actions,
  mutations,
};

export default module;
