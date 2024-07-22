import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Add = () => {
  const { otherUser } = useSelector((store) => store.user);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter users based on search term
  const filteredUsers = otherUser?.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="lg:w-[60%] sm:w-full ml-4 pt-2">
      <div className="p-2 bg-gray-200 rounded-full flex items-center">
        <CiSearch size={"28px"} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent outline-none ml-2 w-full"
          placeholder="Search"
        />
      </div>

      <div className="py-3 px-2 bg-gray-50 shadow-md rounded-2xl my-4">
        <h1 className="font-bold text-xl">Other users</h1>

        {filteredUsers && filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user.id} className="my-2">
              <div className="flex items-center justify-between">
                <div className="flex">
                  <img
                    className="w-10 h-10 mr-2 rounded-full"
                    src={user.avatarUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdA7cY2QU-XyBn41J34i9NIS80gmquBPEerg&s"}
                    alt={user.name}
                  />
                  <div className="ml-0">
                    <h1 className="font-bold">{user.name}</h1>
                    <p className="text-sm text-gray-600">@{user.username}</p>
                  </div>
                </div>
                <Link to={`/profile/${user?._id}`}>
                  <button className="px-4 py-1 text-white bg-[#199ed1] rounded-lg">
                    Profile
                  </button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center mt-4">No users found</p>
        )}
      </div>
    </div>
  );
};

export default Add;
