import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import Feed from "@/components/Feed";
import MobileNav from "@/components/MobileNav";

const HomePage = () => {
  return (
    <div className="bg-[#F0F2F5] min-h-screen">
      <Header />
      
      <div className="pt-16 pb-16 md:pb-4">
        <div className="max-w-screen-2xl mx-auto flex">
          <LeftSidebar />
          <Feed />
          <RightSidebar />
        </div>
      </div>
      
      <MobileNav />
    </div>
  );
};

export default HomePage;
