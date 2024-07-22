import { useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import img from "../assets/logo.png";
import { USER_API_END_POINT } from "../util/util";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { getUser } from "../redux/UserSlice";
import { ClipLoader } from "react-spinners";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = useCallback(async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    setLoading(true);

    try {
      const endpoint = isLogin ? "login" : "register";
      const payload = isLogin ? { email, password } : { name, username, email, password };
      const headers = { "Content-Type": "application/json" };
      const options = { headers, withCredentials: true, timeout: 15000 }; // Set timeout to 10 seconds

      console.log("Requesting:", `${USER_API_END_POINT}/${endpoint}`, payload); // Log request details

      const res = await axios.post(`${USER_API_END_POINT}/${endpoint}`, payload, options);

      if (res.data.success) {
        if (isLogin) {
          dispatch(getUser(res.data.user));
          toast.success(res.data.message);
          navigate("/"); // Redirect to dashboard or another page
        } else {
          setIsLogin(true);
          toast.success(res.data.message);
        }
      } else {
        setError(res.data.message || 'An error occurred. Please try again.');
      }
    } catch (err) {
      console.error("Axios error:", err); // Log the error details
      setError(err.response?.data?.message || `${isLogin ? "Login" : "Signup"} failed. Please try again.`);
    } finally {
      setLoading(false);
    }
  }, [email, password, name, username, isLogin, dispatch, navigate]);

  const loginSignupHandler = () => {
    setIsLogin(!isLogin);
    setError(""); // Clear error message when switching forms
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center relative">
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
          <ClipLoader size={50} color={"#1D9BF0"} />
        </div>
      )}
      <div className="flex flex-row items-center justify-center w-[80%] sm:w-[100%]">
        <img className="hidden md:block md:mr-8" width={"300px"} src={img} alt="logo" />
        <div className="text-center flex flex-col items-center justify-center w-full">
          <h1 className="text-gray-800 text-6xl font-bold">Happening now.</h1>
          <h1 className="mt-4 mb-2 text-2xl font-bold">
            {isLogin ? "Login" : "Signup"}
          </h1>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={submitHandler} className="flex flex-col w-full max-w-md mx-auto">
            {!isLogin && (
              <>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="outline-blue-500 border border-gray-800 px-3 py-2 rounded-full my-1 font-semibold"
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="outline-blue-500 border border-gray-800 px-3 py-2 rounded-full my-1 font-semibold"
                />
              </>
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="outline-blue-500 border border-gray-800 px-3 py-2 rounded-full my-1 font-semibold"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="outline-blue-500 border border-gray-800 px-3 py-2 rounded-full my-1 font-semibold"
            />
            <button className="bg-[#1D9BF0] border-none py-2 my-4 rounded-full text-lg text-white" disabled={loading}>
              {loading ? "Processing..." : isLogin ? "Login" : "Create Account"}
            </button>
            <h1>
              {isLogin ? "Do not have an account?" : "Already have an account?"}{" "}
              <span
                onClick={loginSignupHandler}
                className="font-bold text-blue-600 cursor-pointer"
              >
                {isLogin ? "Signup" : "Login"}
              </span>
            </h1>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
