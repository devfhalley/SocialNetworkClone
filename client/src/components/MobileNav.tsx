import { useLocation } from "wouter";
import { Home, Users, Tv, Store, Bell, Menu } from "lucide-react";

const MobileNav = () => {
  const [location, setLocation] = useLocation();
  
  const isActive = (path: string) => location === path;

  return (
    <nav className="md:hidden fixed bottom-0 w-full bg-white shadow-lg z-50 border-t border-[#E4E6EB]">
      <div className="flex justify-between px-3">
        <button 
          className={`py-2 flex-1 ${isActive('/') ? 'text-[#1877F2] border-t-2 border-[#1877F2]' : 'text-[#65676B]'} flex flex-col items-center`}
          onClick={() => setLocation('/')}
        >
          <Home size={20} />
        </button>
        <button className="py-2 flex-1 text-[#65676B] flex flex-col items-center">
          <Users size={20} />
        </button>
        <button className="py-2 flex-1 text-[#65676B] flex flex-col items-center">
          <Tv size={20} />
        </button>
        <button className="py-2 flex-1 text-[#65676B] flex flex-col items-center">
          <Store size={20} />
        </button>
        <button className="py-2 flex-1 text-[#65676B] flex flex-col items-center">
          <Bell size={20} />
        </button>
        <button className="py-2 flex-1 text-[#65676B] flex flex-col items-center">
          <Menu size={20} />
        </button>
      </div>
    </nav>
  );
};

export default MobileNav;
