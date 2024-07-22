import axios from "axios";
import { USER_API_END_POINT } from "../util/util";
import { useEffect } from "react";
import {useDispatch} from "react-redux";
import { getOhterUser } from "../redux/UserSlice";

const useOtherUsers = (id) => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchOtherUsers = async () => {
            try {
                const res = await axios.get(`${USER_API_END_POINT}/otheruser/${id}`,{
                    withCredentials:true
                });
                console.log(res);
                dispatch(getOhterUser(res.data.otheruser));
            } catch (error) {
                console.log(error);
            }
        }
        fetchOtherUsers();
    },[id]);
};
export default useOtherUsers;