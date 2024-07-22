import express from "express"
import { createPost, deletepost, getAllPost, getFollowingTweets, likeOrDislike } from "../Controller/postController.js";
import isAuthenticated from "../isAuthenticated.js";
 const router=express.Router();


router.route('/create').post(isAuthenticated,createPost)
router.route('/delete/:id').delete(isAuthenticated,deletepost)
router.route('/like/:id').put(isAuthenticated,likeOrDislike)
 router.route("/allposts/:id").get(isAuthenticated, getAllPost);
router.route("/followingposts/:id").get(isAuthenticated,getFollowingTweets);
export default router;