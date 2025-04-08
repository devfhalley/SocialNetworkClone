import { Link, useLocation } from "wouter";
import { useState } from "react";
import { 
  Search, 
  Home, 
  Tv, 
  Store, 
  Users, 
  Gamepad,
  Menu, 
  MessageSquare, 
  Bell, 
  Grid 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types";

const Header = () => {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  // In a real app, this would be based on authentication
  const currentUserId = 1;
  
  const { data: currentUser } = useQuery<User>({
    queryKey: [`/api/users/${currentUserId}`],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Would implement search functionality here
    console.log("Searching for:", searchQuery);
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-white shadow-sm">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between p-2">
        {/* Logo and Search */}
        <div className="flex items-center flex-1">
          <div className="mr-2">
            <Link href="/">
              <a className="cursor-pointer">
                <svg className="w-10 h-10 text-[#1877F2]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="currentColor">
                  <path d="M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z"></path>
                  <path fill="#fff" d="M25 23l.8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h4z"></path>
                </svg>
              </a>
            </Link>
          </div>
          <div className="hidden sm:block relative rounded-full bg-[#F0F2F5] flex-1 max-w-xs">
            <form onSubmit={handleSearch}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-[#65676B]" size={16} />
              </div>
              <input 
                type="text" 
                className="block w-full bg-[#F0F2F5] pl-10 pr-3 py-2 rounded-full text-gray-700 focus:outline-none" 
                placeholder="Search Facebook"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        </div>
        
        {/* Center Nav (Desktop) */}
        <div className="hidden md:flex justify-center flex-1">
          <div className="flex space-x-2">
            <button 
              className="px-10 py-2 text-[#1877F2] border-b-4 border-[#1877F2]"
              onClick={() => setLocation("/")}
            >
              <Home size={24} />
            </button>
            <button className="px-10 py-2 text-[#65676B] hover:bg-[#F0F2F5] rounded-lg">
              <Tv size={24} />
            </button>
            <button className="px-10 py-2 text-[#65676B] hover:bg-[#F0F2F5] rounded-lg">
              <Store size={24} />
            </button>
            <button className="px-10 py-2 text-[#65676B] hover:bg-[#F0F2F5] rounded-lg">
              <Users size={24} />
            </button>
            <button className="px-10 py-2 text-[#65676B] hover:bg-[#F0F2F5] rounded-lg">
              <Gamepad size={24} />
            </button>
          </div>
        </div>
        
        {/* Right Icons */}
        <div className="flex items-center justify-end flex-1">
          <div className="flex items-center space-x-2">
            <button className="p-2 bg-[#F0F2F5] rounded-full text-[#050505] hover:bg-gray-200">
              <Menu size={18} />
            </button>
            <button className="p-2 bg-[#F0F2F5] rounded-full text-[#050505] hover:bg-gray-200">
              <MessageSquare size={18} />
            </button>
            <button className="p-2 bg-[#F0F2F5] rounded-full text-[#050505] hover:bg-gray-200">
              <Bell size={18} />
            </button>
            {currentUser && (
              <Link href={`/profile/${currentUser.id}`}>
                <a className="overflow-hidden rounded-full">
                  <img 
                    src={currentUser.profilePicture} 
                    alt={currentUser.fullName} 
                    className="w-10 h-10 object-cover"
                  />
                </a>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
