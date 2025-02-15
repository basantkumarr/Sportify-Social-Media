import express from "express"
import { Register, Login, logout, bookmark, getMyProfile, getOtherUser, follow, unfollow } from "../Controller/userController.js";
import isAuthenticated from "../isAuthenticated.js";
const router=express.Router();


router.route('/register').post(Register)
router.route('/login').post(Login)
router.route('/logout').get(logout)
router.route('/bookmark/:id').put(isAuthenticated,bookmark)
router.route('/profile/:id').get(isAuthenticated,getMyProfile)
router.route('/otheruser/:id').get(isAuthenticated,getOtherUser)
router.route('/follow/:id').post(isAuthenticated,follow)
router.route('/unfollow/:id').post(isAuthenticated,unfollow)

export default router;