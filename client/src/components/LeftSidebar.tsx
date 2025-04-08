import { Link, useLocation } from "wouter";
import { 
  Users, 
  Store, 
  UserCog, 
  Tv, 
  History, 
  Bookmark, 
  Flag, 
  ChevronDown,
  Gamepad,
  Code,
  Mountain
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { User, SidebarItem } from "@/types";

const LeftSidebar = () => {
  const [, setLocation] = useLocation();
  
  // In a real app, this would be based on authentication
  const currentUserId = 1;
  
  const { data: currentUser } = useQuery<User>({
    queryKey: [`/api/users/${currentUserId}`],
  });

  const sidebarItems: SidebarItem[] = [
    { icon: "user", name: currentUser?.fullName || "Profile", path: `/profile/${currentUserId}` },
    { icon: "users", name: "Friends", path: "/friends" },
    { icon: "store", name: "Marketplace", path: "/marketplace" },
    { icon: "userCog", name: "Groups", path: "/groups" },
    { icon: "tv", name: "Watch", path: "/watch" },
    { icon: "history", name: "Memories", path: "/memories" },
    { icon: "bookmark", name: "Saved", path: "/saved", color: "text-purple-600" },
    { icon: "flag", name: "Pages", path: "/pages", color: "text-orange-500" },
    { icon: "chevronDown", name: "See more" }
  ];

  const shortcuts: SidebarItem[] = [
    { icon: "gamepad", name: "Gaming Group" },
    { icon: "code", name: "Web Developers" },
    { icon: "mountain", name: "Hiking Club" }
  ];

  const renderIcon = (iconName: string, color?: string) => {
    const iconProps = { 
      className: `${color || "text-[#1877F2]"}`, 
      size: 20 
    };
    
    switch(iconName) {
      case "user": return currentUser?.profilePicture ? (
        <img 
          src={currentUser.profilePicture} 
          alt={currentUser.fullName} 
          className="w-8 h-8 rounded-full mr-3" 
        />
      ) : <div className="w-8 h-8 rounded-full bg-[#F0F2F5] flex items-center justify-center mr-3" />;
      case "users": return <Users {...iconProps} className="mr-3" />;
      case "store": return <Store {...iconProps} className="mr-3" />;
      case "userCog": return <UserCog {...iconProps} className="mr-3" />;
      case "tv": return <Tv {...iconProps} className="mr-3" />;
      case "history": return <History {...iconProps} className="mr-3" />;
      case "bookmark": return <Bookmark {...iconProps} className="mr-3" />;
      case "flag": return <Flag {...iconProps} className="mr-3" />;
      case "chevronDown": return <ChevronDown className="text-black mr-3" size={20} />;
      case "gamepad": return <Gamepad className="mr-3" size={20} />;
      case "code": return <Code className="mr-3" size={20} />;
      case "mountain": return <Mountain className="mr-3" size={20} />;
      default: return null;
    }
  };

  return (
    <div className="hidden md:block w-1/4 p-4 pr-2 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto scrollbar-hide">
      <div className="space-y-1">
        {sidebarItems.map((item, index) => (
          <div 
            key={index}
            className="flex items-center p-2 rounded-lg hover:bg-gray-200 cursor-pointer"
            onClick={() => item.path && setLocation(item.path)}
          >
            <div className="w-8 h-8 rounded-full bg-[#F0F2F5] flex items-center justify-center mr-3">
              {renderIcon(item.icon, item.color)}
            </div>
            <span className="text-[#050505] font-medium">{item.name}</span>
          </div>
        ))}
      </div>
      
      <div className="border-t border-[#E4E6EB] my-3"></div>
      
      <div className="mt-3">
        <h3 className="text-gray-500 font-semibold p-2">Your Shortcuts</h3>
        <div className="space-y-1">
          {shortcuts.map((item, index) => (
            <div 
              key={index}
              className="flex items-center p-2 rounded-lg hover:bg-gray-200 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-300 flex items-center justify-center mr-3">
                {renderIcon(item.icon)}
              </div>
              <span className="text-[#050505] font-medium">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-xs text-[#65676B] mt-4 px-2">
        Privacy · Terms · Advertising · Ad Choices · Cookies · More · Meta © 2023
      </div>
    </div>
  );
};

export default LeftSidebar;
