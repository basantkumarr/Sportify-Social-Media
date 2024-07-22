import jwt from "jsonwebtoken";

// Hard-code your secret key here
const TOKEN_SECRET = 'kmswqmmwqwmjwmwxew';

const isAuthenticated = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;

    // If no token, respond with unauthorized status
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated.",
        success: false
      });
    }

    // Verify the token using the hard-coded secret key
    const decode = jwt.verify(token, TOKEN_SECRET);

    // Attach user info to the request object
    req.user = decode.userId;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: "Invalid or expired token.",
      success: false
    });
  }
};

export default isAuthenticated;
