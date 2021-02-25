import { defineModule } from "direct-vuex";
import { moduleActionContext } from "../index";

const state = () => ({
  points: {} as Record<string, boolean>,
  targetIDs: [] as Array<string>,
  isPointLoading: false,
  pointError: "",
});

export type PointState = ReturnType<typeof state>;

const PointMod = defineModule({
  state,
  actions: {
    getPoints: async (context, targetIDs) => {
      const { commit } = pointActionContext(context); // eslint-disable-line
      commit.startLoading();
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

        const points: Record<string, boolean> = JSON.parse(data.points);

        commit.updatePoints(points);
      } catch (error) {
        commit.setPointError(error.message);
        console.log(error.message);
      }
      commit.endLoading();
    },
    incrementComment: async (context, id: string) => {
      const { commit } = pointActionContext(context); // eslint-disable-line
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
        commit.setPointError(error.message);
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
        commit("SubState/updatePostPoints", data.increment.post, {
          root: true,
        });
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
        commit("SubState/updatePostPoints", data.decrement.post, {
          root: true,
        });
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
  },
  mutations: {
    startLoading: (state) => (state.isPointLoading = true),
    endLoading: (state) => (state.isPointLoading = false),
    clearPointState: (state) => {
      state.points = {};
    },
    setPoints: (state, points: Record<string, boolean>) => {
      state.points = points;
    },
    setPointError: (state, error: string) => {
      state.pointError = error;
      setTimeout(() => (state.pointError = ""), 3000);
    },
    updatePoints: (state, obj: Record<string, boolean>) => {
      state.points = { ...state.points, ...obj };
    },
    removePointSuccess: (state, targetId) => {
      delete state.points[targetId];
    },
    setTargetIDs: (state, arr: string[]) => {
      state.targetIDs = arr;
    },
    updateTargetIDs: (state, arr: string[]) => {
      state.targetIDs = [...state.targetIDs, ...arr];
    },
  },
});

export default PointMod;
const pointActionContext = (
  context: any // eslint-disable-line
) => moduleActionContext(context, PointMod);
