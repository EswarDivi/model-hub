import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { AiOutlineMenu, AiOutlineSearch } from "react-icons/ai"; // Hamburger Menu Icon

const Navbar = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const userprofilepic = user?.profilepic || "https://www.gravatar.com/avatar/$%7Bdemo%7D?d=identicon";
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState({ users: [], models: [] });


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);

  };

  const handleSearchClick = async () => {
    if (!searchTerm) {
      console.log("Search term is empty or undefined.");
      return;
    }

    const usersResponse = await fetch('https://modelhub-backend.vercel.app/getallusers');
    const users = await usersResponse.json();

    const modelsResponse = await fetch('https://modelhub-backend.vercel.app/getallmodels');
    const models = await modelsResponse.json();

    const matchedUsers = users.filter(user => user.username && user.username.includes(searchTerm));
    const matchedModels = models.filter(model => model.modelname && model.modelname.includes(searchTerm));

    setSearchResults({ users: matchedUsers, models: matchedModels });

  };

  const handleViewProfile = () => {
    navigate('/ViewProfile', { state: { user } });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 p-5">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center justify-between w-full md:w-1/5">
            <Link to="/" className="text-white hover:text-gray-300">
              <img src="https://i.ibb.co/6F688Ds/weblogo.png" alt="Logo" className="h-12" />
            </Link>

            {/* Mobile Menu Button */}
            <button className="text-white hover:text-gray-300 md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <AiOutlineMenu size="1.5em" />
            </button>
          </div>

          <div className="relative w-full md:w-1/5 mt-4 md:mt-0">
            {/* Search Bar */}
            <div className={`search-bar ${isMobileMenuOpen ? "block" : "hidden md:block"} transition-all ease-in-out duration-300`}>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full p-2 border border-gray-300 rounded-md text-gray-700 bg-white focus:ring-2 focus:ring-gray-300 focus:outline-none"
              />
              <button
                onClick={handleSearchClick}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-3 py-1 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <AiOutlineSearch />
              </button>
            </div>

            {/* Floating Search Results */}
            {searchTerm && (searchResults.users.length > 0 || searchResults.models.length > 0) && (
              <div className="search-results absolute z-10 bg-white rounded-md shadow-lg p-4 mt-1 w-full">
                <h3 className="text-gray-800 font-semibold">Search Results</h3>

                {/* Users Section */}
                {searchResults.users.length > 0 && (
                  <div>
                    <h4 className="text-gray-700 font-semibold mt-2">Users</h4>
                    {searchResults.users.map(user => (
                      <a href={`user/${user.username}`} className="hover:text-blue-400">
                        <p key={user.id} className="text-gray-600">{user.username}</p>
                      </a>
                    ))}
                  </div>
                )}

                {/* Models Section */}
                {searchResults.models.length > 0 && (
                  <div>
                    <h4 className="text-gray-700 font-semibold mt-2">Models</h4>
                    {searchResults.models.map(model => (
                      <a href={`model/${model.modeltokenid}`} className="hover:text-blue-400">

                        <p key={model.id} className="text-gray-600">{model.modelname}</p>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className={`w-full md:w-2/5 flex justify-evenly mt-4 md:mt-0 ${isMobileMenuOpen ? "flex" : "hidden md:flex"}`}>
            <Link to="/" className="text-white hover:text-gray-300 mx-2">
              Home
            </Link>
            <Link to="/explore" className="text-white hover:text-gray-300 mx-2">
              Explore
            </Link>
            <Link to="/models" className="text-white hover:text-gray-300 mx-2">
              Models
            </Link>
            {isLoggedIn && user?.role === "admin" && (
              <Link to="/admin" className="text-white hover:text-gray-300 mx-2">
                Admin
              </Link>
            )}
          </div>

          <div className={`w-full md:w-1/5 mt-4 md:mt-0 ${isMobileMenuOpen ? "block" : "hidden md:block"}`}>
            {isLoggedIn ? (
              <div className="flex justify-evenly items-center relative">
                <Link to="/ViewProfile">
                  <div
                    className="relative group"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <img
                      src={userprofilepic}
                      alt="Profile"
                      className="rounded-full w-10 h-10 ml-4 cursor-pointer"
                    />
                    {isHovered && (
                      <button
                        onClick={handleViewProfile}
                        className="absolute bg-gray-800 text-white px-2 py-1 mt-2 rounded-md group-hover:block cursor-pointer"
                      >
                        View Profile
                      </button>
                    )}
                  </div>
                </Link>
                <button onClick={handleLogout} className="text-white hover:text-gray-300">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex justify-evenly">
                <Link to="/login" className="text-white hover:text-gray-300 mx-2">
                  Login
                </Link>
                <Link to="/signup" className="text-white hover:text-gray-300 mx-2">
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;
