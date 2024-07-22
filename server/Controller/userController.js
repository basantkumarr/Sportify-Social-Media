import { User } from "../models/UserSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register endpoint
export const Register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Validate input
    if (!name || !username || !email || !password) {
      return res.status(400).json({
        message: "Please fill all the fields.",
        success: false,
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email }).exec();

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists.",
        success: false,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12); // Reduced salt rounds for slightly better performance

    // Create new user
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });

    // Send response with cookie
    return res
      .status(201)
      .cookie("token", token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        httpOnly: true,
        sameSite: 'Strict', // Added security measure
      })
      .json({
        message: "User registered successfully.",
        user: {
          _id: newUser._id,
          name: newUser.name,
          username: newUser.username,
          email: newUser.email,
        },
        success: true,
      });
  } catch (error) {
    console.error("Registration error:", error); // More specific error logging
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};


export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

    // Fetch user
    const user = await User.findOne({ email }).exec();

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    // Validate password match
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });

    // Send response with cookie
    return res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        httpOnly: true,
        sameSite: 'Strict', // Added security measure
      })
      .json({
        message: `Welcome back ${user.name}`,
        user: {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
        },
        success: true,
      });
  } catch (error) {
    console.error("Login error:", error); // More specific error logging
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
