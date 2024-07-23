import { useSelector } from 'react-redux';
import Fed from './Fed';
import Tweet from './Tweet';

const Mid = () => {
  const { posts } = useSelector((store) => store.post);

  console.log("Posts in Mid component:", posts); // Debugging log

  return (
    <div className='lg:w-[60%] sm:w-[100%]  border border-gray-200 h-screen overflow-y-auto custom-scrollbar'>
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
