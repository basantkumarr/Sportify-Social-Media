import axios from 'axios';
import { POST_API_END_POINT } from '../util/util';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPost } from '../redux/postslice';

const useGetMyPost = (id) => {
  const dispatch = useDispatch();
  const { refresh, isActive } = useSelector((store) => store.post);

  const fetchMyPost = async () => {
    try {
      const res = await axios.get(`${POST_API_END_POINT}/allposts/${id}`, {
        withCredentials: true,
      });
      console.log('Response from server:', res); // Log the entire response object
      if (res.data.success) {
        dispatch(getAllPost(res.data.posts));
      } else {
        console.error('Failed to fetch posts:', res.data.message);
      }
    } catch (error) {
      console.error('Error fetching posts:', error); // Log the error for debugging
    }
  };

  const followingTweetHandler = async () => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.get(`${POST_API_END_POINT}/followingposts/${id}`);
      console.log('Following posts response:', res); // Log the response object
      dispatch(getAllPost(res.data.posts));
    } catch (error) {
      console.error('Error fetching following posts:', error); // Log the error for debugging
    }
  };

  useEffect(() => {
    if (id) {
      if (isActive) {
        fetchMyPost();
      } else {
        followingTweetHandler();
      }
    }
  }, [isActive, refresh, id]); // Added id to dependencies to re-fetch if id changes
};

export default useGetMyPost;
