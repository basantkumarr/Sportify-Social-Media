import { useRef, useState } from "react";
import { CiImageOn } from "react-icons/ci";
import axios from "axios";
import { POST_API_END_POINT } from "../util/util";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getIsActive, getRefresh } from "../redux/postslice";

const Fed = () => {
  const [description, setDescription] = useState("");
  const { user } = useSelector((state) => state.user);
  const { isActive } = useSelector((state) => state.post);
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!user || !user._id) {
      toast.error("User is not logged in or user ID is missing");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("id", user._id);

      if (file) {
        formData.append("file", file);
      }

      const res = await axios.post(
        `${POST_API_END_POINT}/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setDescription("");
        setFile(null);
        dispatch(getRefresh());
      } else {
        toast.error(res.data.message || "An error occurred");
      }
    } catch (err) {
      console.error("Error response from server:", err.response);
      toast.error(err.response?.data?.message || "An error occurred");
    }
  };

  const forYouHandler = () => {
    dispatch(getIsActive(true));
  };

  const followingHandler = () => {
    dispatch(getIsActive(false));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleImgClick = () => {
    inputRef.current.click();
  };

  return (
    <div className="w-full ">
      <div className="mx-2">
        <div className="flex items-center justify-between border-b border-gray-200">
          <div
            onClick={forYouHandler}
            className={`flex-1 cursor-pointer hover:bg-gray-200 text-center px-4 py-3 ${
              isActive ? "border-b-2 border-[#199ed1]" : "border-b-4 border-transparent"
            }`}
          >
            <h1 className="font-semibold text-gray-600 text-lg">For you</h1>
          </div>
          <div
            onClick={followingHandler}
            className={`flex-1 cursor-pointer hover:bg-gray-200 text-center px-4 py-3 ${
              !isActive ? "border-b-2 border-[#199ed1]" : "border-b-4 border-transparent"
            }`}
          >
            <h1 className="font-semibold text-gray-600 text-lg">Following</h1>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center pb-3">
            <img
              className="rounded-full"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdA7cY2QU-XyBn41J34i9NIS80gmquBPEerg&s"
              alt="User Avatar"
              width="40px"
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full ml-3 outline-none border-none text-lg"
              type="text"
              placeholder="What is happening?!"
            />
          </div>
          <div className="flex items-center justify-between my-4 border-b border-gray-300 pb-2">
            <div onClick={handleImgClick}>
              <CiImageOn size="30px" color="green" />
              <input
                type="file"
                ref={inputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
            <button
              onClick={submitHandler}
              className="px-4 py-1 border-none text-lg bg-[#199ed1] rounded-full text-white font-bold"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fed;
