import PropTypes from "prop-types";
import { FaRegComment } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { CiHeart, CiBookmark } from "react-icons/ci";
import axios from "axios";
import { POST_API_END_POINT } from "../util/util";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { getRefresh } from "../redux/postslice";
import { timeSince } from "../util/util";

const Tweet = ({ tweet }) => {
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const likeOrDislikeHandler = async (id) => {
    try {
      const res = await axios.put(
        `${POST_API_END_POINT}/like/${id}`,
        { id: user?._id },
        { withCredentials: true }
      );
      dispatch(getRefresh());
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error liking the post");
    }
  };

  const deleteTweetHandler = async (id) => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.delete(`${POST_API_END_POINT}/delete/${id}`);
      dispatch(getRefresh());
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting the post");
    }
  };

  return (
    <div className= "border-b border-gray-200">
      <div className="flex p-2">
        <img
          className="w-10 h-10 rounded-full mr-4"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdA7cY2QU-XyBn41J34i9NIS80gmquBPEerg&s"
          alt="User Avatar"
        />
        <div className="ml-2 w-full">
          <div className="flex items-center">
            <h1 className="font-bold">{tweet?.userDetails[0]?.name}</h1>
            <p className="text-gray-500 text-sm ml-1">{`@${
              tweet?.userDetails[0]?.username
            } • ${timeSince(tweet?.createdAt)}`}</p>
          </div>
          <div>
            <p>{tweet?.description}</p>
            {tweet?.image && (
              <img
                src={`http://localhost:8000/${tweet.image}`} // Adjust server URL and path
                alt="Tweet Image"
                className="my-4 rounded-lg w-full"
              />
            )}
          </div>
          <div className="flex justify-between my-3">
            <div className="flex items-center">
              <div className="p-2 hover:bg-green-200 rounded-full cursor-pointer">
                <FaRegComment size="20px" />
              </div>
              <p>0</p>
            </div>
            <div className="flex items-center">
              <div
                onClick={() => likeOrDislikeHandler(tweet?._id)}
                className="p-2 hover:bg-pink-200 rounded-full cursor-pointer"
              >
                <CiHeart size="24px" />
              </div>
              <p>{tweet?.like?.length}</p>
            </div>
            <div className="flex items-center">
              <div className="p-2 hover:bg-yellow-200 rounded-full cursor-pointer">
                <CiBookmark size="24px" />
              </div>
              <p>0</p>
            </div>
            {user?._id === tweet?.userId && (
              <div
                onClick={() => deleteTweetHandler(tweet?._id)}
                className="flex items-center"
              >
                <div className="p-2 hover:bg-red-300 rounded-full cursor-pointer">
                  <MdOutlineDeleteOutline size="24px" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Tweet.propTypes = {
  tweet: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    userDetails: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
      })
    ).isRequired,
    createdAt: PropTypes.string.isRequired,
    like: PropTypes.array.isRequired,
    userId: PropTypes.string.isRequired,
    image: PropTypes.string,
  }).isRequired,
};

export default Tweet;
