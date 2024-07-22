import { Post } from "../models/PostSchema.js";
import { User } from "../models/UserSchema.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve("public/images"); // Adjust the path as per your setup
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        console.error("Error creating upload directory:", err);
        cb(err, null);
      } else {
        cb(null, uploadPath);
      }
    });
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to file name
  },
});

const upload = multer({ storage: storage });

export const createPost = async (req, res) => {
  try {
    upload.single("file")(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: "File upload error", success: false });
      }

      const { description, id } = req.body;
      const file = req.file;

      if (!description || !id) {
        return res.status(400).json({
          message: "Fields are required",
          success: false,
        });
      }

      const user = await User.findById(id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found", success: false });
      }

      const newPost = new Post({
        description,
        userId: id,
        userDetails: user,
        image: file ? `images/${file.filename}` : null, // Save relative path
      });
      await newPost.save();

      return res.status(201).json({
        message: "Post created successfully",
        success: true,
        post: newPost, // Optionally return the created post
      });
    });
  } catch (err) {
    console.error("Error in createPost:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const deletepost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found", success: false });
    }
    return res.status(200).json({
      message: "Post deleted successfully",
      success: true,
    });
  } catch (err) {
    console.error("Error in deletepost:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const likeOrDislike = async (req, res) => {
  try {
    const { id: loggedInUserId } = req.body;
    const { id: tweetId } = req.params;

    const post = await Post.findById(tweetId);
    if (!post) {
      return res.status(404).json({ message: "Post not found", success: false });
    }

    const isLiked = post.like.includes(loggedInUserId);
    if (isLiked) {
      await Post.findByIdAndUpdate(tweetId, { $pull: { like: loggedInUserId } });
      return res.status(200).json({ message: "User disliked your post.", success: true });
    } else {
      await Post.findByIdAndUpdate(tweetId, { $push: { like: loggedInUserId } });
      return res.status(200).json({ message: "User liked your post.", success: true });
    }
  } catch (err) {
    console.error("Error in likeOrDislike:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const allPosts = await Post.find().sort({ createdAt: -1 }); // Sort by createdAt in descending order
    return res.status(200).json({
      success: true,
      posts: allPosts,
    });
  } catch (err) {
    console.error("Error in getAllPost:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getFollowingTweets = async (req, res) => {
  try {
    const { id } = req.params;
    const loggedInUser = await User.findById(id);
    if (!loggedInUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const followingUserTweets = await Post.find({ userId: { $in: loggedInUser.following } }).sort({ createdAt: -1 }); // Sort by createdAt in descending order
    return res.status(200).json({ posts: followingUserTweets });
  } catch (err) {
    console.error("Error in getFollowingTweets:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
