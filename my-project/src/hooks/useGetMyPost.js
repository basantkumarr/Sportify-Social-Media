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
      if (!id) {
        throw new Error('Invalid ID');
      }
      const res = await axios.get(`${POST_API_END_POINT}/allposts/${id}`, {
        withCredentials: true,
      });
      console.log('Response from server:', res);
      if (res.data.success) {
        dispatch(getAllPost(res.data.posts));
      } else {
        console.error('Failed to fetch posts:', res.data.message);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const followingTweetHandler = async () => {
    try {
      if (!id) {
        throw new Error('Invalid ID');
      }
      const res = await axios.get(`${POST_API_END_POINT}/followingposts/${id}`, {
        withCredentials: true,
      });
      console.log('Response from server:', res);
      if (res.data.success) {
        dispatch(getAllPost(res.data.posts));
      } else {
        console.error('Failed to fetch following posts:', res.data.message);
      }
    } catch (error) {
      console.error('Error fetching following posts:', error);
    }
  };

  useEffect(() => {
    if (isActive) {
      fetchMyPost();
    } else {
      followingTweetHandler();
    }
  }, [isActive, refresh, id]); // Ensure 'id' is included in dependencies

};

export default useGetMyPost;
