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
      const options = { headers, withCredentials: true };
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
        setError(res.data.message);
      }
    } catch (err) {
      console.error(err);
	@@ -64,19 +64,15 @@ const Login = () => {
          <ClipLoader size={50} color={"#1D9BF0"} />
        </div>
      )}
      <div className="flex items-center justify-evenly w-[80%]">
        <div>
          <img className="j" width={"300px"} src={img} alt="logo" />
        </div>
        <div>
          <div className="my-5">
            <h1 className="font-bold text-gray-800 text-6xl">Happening now.</h1>
          </div>
          <h1 className="mt-4 mb-2 text-2xl font-bold">
            {isLogin ? "Login" : "Signup"}
          </h1>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={submitHandler} className="flex flex-col w-[55%]">
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
