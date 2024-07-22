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

    // Store plain text password (not recommended for production)
    await User.create({
      name,
      username,
      email,
      password,
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

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
        success: false,
      });
    }

    // Find user by email
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    // Compare plain text password (not recommended for production)
    if (user.password !== password) {
      return res.status(401).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    // Check TOKEN_SECRET
    const tokenSecret = 'kmswqmmwqwmjwmwxew';
  

    // Create JWT token
    const tokenData = { userId: user._id };
    const token = jwt.sign(tokenData, tokenSecret, { 
      expiresIn: "1d" // Token expiration time
    });

    // Set secure cookie
    return res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        httpOnly: true, // Prevents JavaScript access
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'Strict' // Prevents CSRF attacks
      })
      .json({
        message: `Welcome back ${user.name}`,
        user: {
          name: user.name,
          email: user.email,
          username: user.username // Send minimal user data
        },
        success: true,
      });
  } catch (error) {
    console.error('Login error:', error); // Log the error for debugging
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message // Return the error message in the response for debugging
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
