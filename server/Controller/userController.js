import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/UserSchema.js";

// Register endpoint
export const Register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return res.status(400).json({
        message: "Please fill all the fields",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    // Hash the password before saving
    const hashPassword = await bcryptjs.hash(password, 12);
    await User.create({
      name,
      username,
      email,
      password: hashPassword,
    });

    return res.status(201).json({
      message: "User created successfully",
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

// Login endpoint
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    // Compare the hashed password with the provided password
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const tokenData = { userId: user._id };
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "1d" });

    return res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        httpOnly: true,
      })
      .json({
        message: `Welcome back ${user.name}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
  });
  
  return res.json({
    message: "User logged out successfully.",
    success: true,
  });
};

export const bookmark = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const tweetId = req.params.id;
    const user = await User.findById(loggedInUserId);
    if (user.bookmarks.includes(tweetId)) {
      // remove
      await User.findByIdAndUpdate(loggedInUserId, {
        $pull: { bookmarks: tweetId },
      });
      return res.status(200).json({
        message: "Removed from bookmarks.",
      });
    } else {
      // bookmark
      await User.findByIdAndUpdate(loggedInUserId, {
        $push: { bookmarks: tweetId },
      });
      return res.status(200).json({
        message: "Saved to bookmarks.",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
export const getMyProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select("-password");
    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getOtherUser = async (req, res) => {
  try {
    const { id } = req.params;
    const otheruser = await User.find({ _id: { $ne: id } }).select("-password");

    if (!otheruser) {
      res.status(401).json({
        message: "Currently do not have any user",
      });
    }
    return res.status(200).json({
      otheruser,
    });
  } catch (error) {
    console.log(error);
  }
};

export const follow = async(req,res)=>{
  try {
      const loggedInUserId = req.body.id; 
      const userId = req.params.id; 
      const loggedInUser = await User.findById(loggedInUserId);//patel
      const user = await User.findById(userId);//keshav
      if(!user.followers.includes(loggedInUserId)){
          await user.updateOne({$push:{followers:loggedInUserId}});
          await loggedInUser.updateOne({$push:{following:userId}});
      }else{
          return res.status(400).json({
              message:`User already followed to ${user.name}`
          })
      };
      return res.status(200).json({
          message:`${loggedInUser.name} just follow to ${user.name}`,
          success:true
      })
  } catch (error) {
      console.log(error);
  }
}
export const unfollow = async (req,res) => {
  try {
      const loggedInUserId = req.body.id; 
      const userId = req.params.id; 
      const loggedInUser = await User.findById(loggedInUserId);//patel
      const user = await User.findById(userId);//keshav
      if(loggedInUser.following.includes(userId)){
          await user.updateOne({$pull:{followers:loggedInUserId}});
          await loggedInUser.updateOne({$pull:{following:userId}});
      }else{
          return res.status(400).json({
              message:`User has not followed yet`
          })
      };
      return res.status(200).json({
          message:`${loggedInUser.name} unfollow to ${user.name}`,
          success:true
      })
  } catch (error) {
      console.log(error);
  }
}
