/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/no-use-before-define */

import { defineModule } from "direct-vuex";
import { moduleActionContext } from "../index";
import router from "@/router/index";
import type {Post, Comment} from "./types"

interface NewPost {
  title: string;
  body: string;
}

interface CreatePostObj {
  subId: string;
  post: NewPost;
}

const state = () => ({
  post: null as Post | null,
  isPostLoading: false,
  postError: "",
});

export type PostState = ReturnType<typeof state>;

const PostMod = defineModule({
  state,
  actions: {
    getPostAndComments: async (context, postID: string) => {
      const { commit, rootCommit } = postActionContext(context);
      commit.startLoading();
      try {
        const res = await fetch(`/gql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query Input($postID: String!, ) {
              post(postID: $postID,){
                  _id
                 title
                 body
                 points
                 user {
                     name
                 }
                 sub
                 createdAt
                 commentsMap
                 targetIDs
              }
          }`,
            variables: {
              postID: postID,
            },
          }),
        });

        const { errors, data } = await res.json();

        if (errors) throw Error(errors[0].message);

        const comments: Record<string, Comment[]> = data.post.commentsMap
        const sort = "points"
        const targetIDs: string[] = data.post.targetIDs
        delete data.post.commentsMap
        delete data.post.targetIDs
        const post: Post = data.post;

        commit.setPost(post);
        rootCommit.setComments({post, comments, sort})

        if (comments[postID].length < 10) {
          rootCommit.noMoreComments()
        }

        rootCommit.setTargetIDs(targetIDs)
      } catch (error) {
        console.error(error);
        commit.setPostError(error.message);
      }
      commit.endLoading();
    },
    createPost: async (context, obj: {subId: string, post: {title: string, body: string}}) => {
      const { commit } = postActionContext(context);
      commit.startLoading();
      try {
        const res = await fetch(`/api/v1/posts/${obj.subId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(obj.post),
        });

        const json = await res.json();

        if (json.success) {
          router.push(
            `/s/${router.currentRoute.value.params.sub}/comments/${json.data._id}`
          );
        }
      } catch (error) {
        console.error(error);
        commit.setPostError(error.message);
      }
      commit.endLoading();
    },
  },
  mutations: {
    startLoading: (state) => (state.isPostLoading = true),
    endLoading: (state) => (state.isPostLoading = false),
    setPost: (state, post: Post) => (state.post = post),
    setPostError: (state, error: string) => {
      state.postError = error;
      setTimeout(() => (state.postError = ""), 3000);
    },
    Post_updatePostPoints: (state, points: number) => {
      if (state.post) {
        state.post.points = points;
      }
    },
    clearPostsState: (state) => {
      state.post = null;
    },
  },
});

export default PostMod;
const postActionContext = (context: any) => // eslint-disable-line
  moduleActionContext(context, PostMod);
