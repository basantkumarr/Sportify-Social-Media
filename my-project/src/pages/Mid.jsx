import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Fed from './Fed';
import Tweet from './Tweet';
import useGetMyPost from '../hooks/useGetMyPost';
import { getRefresh } from '../redux/actions/postActions'; // Ensure you import the correct action

const Mid = () => {
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.post);
  const userId = useSelector((state) => state.user.user?._id); // Adjust according to your state structure

  // Debugging logs
  console.log("User ID in Mid component:", userId);
  console.log("Posts in Mid component:", posts);

  // Use custom hook to fetch posts
  useGetMyPost(userId);

  useEffect(() => {
    // Fetch posts when component mounts or userId changes
    if (userId) {
      dispatch(getRefresh()); // Trigger refresh if needed
    }
  }, [userId, dispatch]);

  return (
    <div className='lg:w-[60%] sm:w-[100%] border border-gray-200 h-screen overflow-y-auto custom-scrollbar'>
      <div>
        <Fed />
        {posts && posts.length > 0 ? (
          posts.map((post) => <Tweet key={post?._id} tweet={post} />)
        ) : (
          <p className='text-center'>No posts available...</p>
        )}
      </div>
    </div>
  );
};

export default Mid;

