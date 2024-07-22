import { IoMdArrowBack } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from 'react-router-dom';
import useGetProfile from "../hooks/useGetProfile";
import axios from "axios";
import { USER_API_END_POINT } from "../util/util";
import { followingUpdate } from "../redux/UserSlice";
import { getRefresh } from "../redux/postslice";
import toast from "react-hot-toast";

const Profile = () => {
    const { user, profile } = useSelector(store => store.user);
    const { id } = useParams();
    const dispatch = useDispatch();
    useGetProfile(id);

    const followAndUnfollowHandler = async () => {
        try {
            axios.defaults.withCredentials = true;
            const action = user.following.includes(id) ? 'unfollow' : 'follow';
            const res = await axios.post(`${USER_API_END_POINT}/${action}/${id}`, { id: user?._id });
            dispatch(followingUpdate(id));
            dispatch(getRefresh());
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
            console.error(error);
        }
    }

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div className='lg:w-[60%] sm:w-[100%] border-l border-r border-gray-200'>
            <div>
                <div className='flex items-center py-2'>
                    <Link to="/" className='p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer'>
                        <IoMdArrowBack size="24px" />
                    </Link>
                    <div className='ml-2'>
                        <h1 className='font-bold text-lg'>{profile.name}</h1>
                        <p className='text-gray-500 text-sm'>10 posts</p>
                    </div>
                </div>
                <img src="https://pbs.twimg.com/profile_banners/1581707412922200067/1693248932/1080x360" alt="banner" className='w-full' />
                <div className='relative'>
                    <div className='absolute -top-16 ml-4 sm:ml-2 border-4 border-white rounded-full'>
                        <img className="rounded-full" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdA7cY2QU-XyBn41J34i9NIS80gmquBPEerg&s" alt="Profile" width={"90px"} />
                    </div>
                </div>
                <div className='text-right mt-16 mr-4'>
                    {profile?._id === user?._id ? (
                        <button className='px-4 py-1 hover:bg-gray-200 rounded-full border border-gray-400'>Edit Profile</button>
                    ) : (
                        <button onClick={followAndUnfollowHandler} className='px-4 py-1 bg-[#199ed1] text-white rounded-full'>
                            {user.following.includes(id) ? "Following" : "Follow"}
                        </button>
                    )}
                </div>
                <div className='m-4'>
                    <h1 className='font-bold text-xl'>{profile.name}</h1>
                    <p>@{profile.username}</p>
                </div>
                <div className='m-4 text-sm'>
                    <p>🌐 Exploring the webs endless possibilities with MERN Stack 🚀 | Problem solver by day, coder by night 🌙 | Coffee lover ☕ | Join me on this coding journey!</p>
                </div>
            </div>
        </div>
    );
}

export default Profile;
