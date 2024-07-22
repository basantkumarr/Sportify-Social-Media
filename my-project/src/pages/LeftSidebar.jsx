import { RiHome2Line } from "react-icons/ri";
import { FiHash } from "react-icons/fi";
 import { CgProfile } from "react-icons/cg";
import { MdLogout } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '../util/util';
import { getUser, getMyProfile, getOhterUser } from '../redux/UserSlice';
import toast from 'react-hot-toast';
import logo from "../assets/logo.png";
import { MdOutlinePersonAddAlt } from "react-icons/md";

const LeftSidebar = () => {
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`);
      dispatch(getUser(null));
      dispatch(getOhterUser(null)); // Assuming this clears other user state
      dispatch(getMyProfile(null));  
      navigate('/login');
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='sidebar mx-0 lg:w-[20%] sm:w-[20%] px-2 mr-0'>
      <div>
        <Link to='/'>
          <div className=' flex align-middle '>
            <img width={"45px"} src={logo} alt='logo' />
            <div className='text-3xl mt-1 text-[#0f83c6]  logo-container font-semibold'>Sportify</div>
          </div>
        </Link>
        <div className='my-4'>
          <Link to='/'>
            <div className='sidebar-item'>
              <div>
                <RiHome2Line size={"28px"} />
              </div>
              <h1 className='font-bold text-lg ml-2'>Home</h1>
            </div>
          </Link>
          <div className='sidebar-item'>
            <div>
              <FiHash size={"28px"} />
            </div>
            <h1 className='font-bold text-lg ml-2'>Explore</h1>
          </div>
          <Link to='/add'>

          <div className='sidebar-item'>
            <div>
              <MdOutlinePersonAddAlt 
              size={"28px"} />
            </div>
            <h1 className='font-bold text-lg te ml-2'>Add Freinds</h1>
          </div>
          </Link>

          <Link to={`/profile/${user?._id}`}>
            <div className='sidebar-item'>
              <div>
                <CgProfile size={"28px"} />
              </div>
              <h1 className='font-bold text-lg ml-2'>Profile</h1>
            </div>
          </Link>
          <div className='sidebar-item' onClick={logoutHandler}>
            <div>
              <MdLogout size={"28px"} />
            </div>
            <h1 className='font-bold text-lg ml-2'>Logout</h1>
          </div>
          <Link to='/'>
            <button className='post-button px-4 py-2 border-none text-md bg-[#199ed1] w-full rounded-full text-white font-bold'>
              Post
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
