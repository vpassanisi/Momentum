import { MutationTree, ActionTree } from "vuex";

interface PointState {
  points: Record<string, boolean>;
  targetIds: Array<string>;
  isPointLoading: boolean;
  pointError: null | string;
}

const module = {
  namespaced: true,
  state: {
    points: {},
    targetIds: [],
    isPointLoading: false,
    pointError: null,
  },
  actions: {
    clearPointState: ({ commit }) => {
      commit("clearPointState");
    },
    getPoints: async ({ commit }, arr: Array<string>) => {
      commit("startLoading");
      try {
        const res = await fetch(`/api/v1/points`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: arr }),
        });

        const json = await res.json();

        if (json.success) {
          commit("getPointsSuccess", json.data);
        } else {
          commit("getPointsFail", json.message);
        }
      } catch (error) {
        console.log(error);
        commit("getPointsfail", "Promise rejected with an error");
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
        const res = await fetch(
          `/api/v1/points/increment/?type=post&id=${id}`,
          {
            method: "POST",
          }
        );

        const json = await res.json();

        if (json.success) {
          commit("incrementPostSuccess", json.data.point);
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
        const res = await fetch(
          `/api/v1/points/decrement/?type=post&id=${id}`,
          {
            method: "POST",
          }
        );

        const json = await res.json();

        if (json.success) {
          commit("decrementPostSuccess", json.data.point);
        } else {
          commit("decrementPostFail", json.message);
        }
      } catch (error) {
        console.log(error);
        commit("decrementPostFail", "Promise rejected with an error");
      }
    },
  } as ActionTree<PointState, null>,
  mutations: {
    startLoading: (state) => (state.isPointLoading = true),
    endLoading: (state) => (state.isPointLoading = false),
    clearPointState: (state) => {
      state.points = {};
      state.targetIds = [];
    },
    getPointsSuccess: (state, points) => {
      state.points = points;
    },
    getPointsFail: (state, error) => {
      state.pointError = error;
      setTimeout(() => (state.pointError = null), 3000);
    },
    incrementCommentSuccess: (state, obj) => {
      state.points = { ...state.points, ...obj };
    },
    incrementCommentFail: (state, error) => {
      state.pointError = error;
      setTimeout(() => (state.pointError = null), 3000);
    },
    decrementCommentSuccess: (state, obj) => {
      state.points = { ...state.points, ...obj };
    },
    decrementCommentFail: (state, error) => {
      state.pointError = error;
      setTimeout(() => (state.pointError = null), 3000);
    },
    incrementPostSuccess: (state, obj) => {
      state.points = { ...state.points, ...obj };
    },
    incrementPostFail: (state, error) => {
      state.pointError = error;
      setTimeout(() => (state.pointError = null), 3000);
    },
    decrementPostSuccess: (state, obj) => {
      state.points = { ...state.points, ...obj };
    },
    decrementPostFail: (state, error) => {
      state.pointError = error;
      setTimeout(() => (state.pointError = null), 3000);
    },
    setTargetIds: (state, arr) => {
      state.targetIds = arr;
    },
  } as MutationTree<PointState>,
};

export default module;
