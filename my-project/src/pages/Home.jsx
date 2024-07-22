 import { Outlet } from "react-router-dom";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import { useSelector } from "react-redux";
import useOtherUsers from "../hooks/useOtherUsers";
 import useGetMyPost from "../hooks/useGetMyPost";
 import {  useNavigate } from "react-router-dom";
 import { useEffect } from "react";

const Home = () => {


  const {user}=useSelector(store=>store.user);
  const navigate = useNavigate();


  useEffect(()=>{
    if (!user) {
      navigate("/login");
    }
  },[]);
  useOtherUsers(user?._id);
useGetMyPost(user?._id);
 

  return (
    

    <div className="flex mt-2   w-[95%] xs:w-full  mx-1 mx-auto">
      <LeftSidebar />
         <Outlet /> 
       <RightSidebar />
    </div>
  );
}

export default Home;
