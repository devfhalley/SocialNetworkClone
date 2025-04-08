import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import Post from "@/components/Post";
import { User, Post as PostType } from "@/types";
import { Camera, Edit, Plus } from "lucide-react";

const ProfilePage = () => {
  const { id } = useParams();
  const userId = parseInt(id as string);
  const [expandedPosts, setExpandedPosts] = useState<number[]>([]);
  
  // In a real app, this would be based on authentication
  const currentUserId = 1;
  
  const { data: user, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: [`/api/users/${userId}`],
    enabled: !isNaN(userId),
  });
  
  const { data: posts, isLoading: isLoadingPosts } = useQuery<PostType[]>({
    queryKey: [`/api/users/${userId}/posts`],
    enabled: !isNaN(userId),
  });
  
  const { data: users } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });
  
  const isCurrentUser = userId === currentUserId;
  
  const toggleComments = (postId: number) => {
    setExpandedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId) 
        : [...prev, postId]
    );
  };
  
  if (isLoadingUser || isLoadingPosts || !users) {
    return (
      <div className="bg-[#F0F2F5] min-h-screen">
        <Header />
        <div className="pt-16 pb-16 md:pb-4">
          <div className="max-w-screen-lg mx-auto">
            <div className="animate-pulse bg-white h-72 rounded-b-lg"></div>
            <div className="animate-pulse bg-white mt-4 h-32 rounded-lg"></div>
            <div className="animate-pulse bg-white mt-4 h-80 rounded-lg"></div>
          </div>
        </div>
        <MobileNav />
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="bg-[#F0F2F5] min-h-screen">
        <Header />
        <div className="pt-16 pb-16 md:pb-4">
          <div className="max-w-screen-lg mx-auto p-4">
            <div className="bg-white rounded-lg p-8 text-center">
              <h1 className="text-2xl font-bold">User not found</h1>
              <p className="mt-2 text-gray-500">The user you're looking for does not exist or has been removed.</p>
            </div>
          </div>
        </div>
        <MobileNav />
      </div>
    );
  }
  
  // Process posts with user data
  const processedPosts = posts?.map(post => {
    const postUser = users.find(u => u.id === post.userId) || user;
    
    // In a real app, we would fetch actual like and comment count
    // Here, we'll simulate it from our local data
    const likeCount = Math.floor(Math.random() * 1000);
    const commentCount = Math.floor(Math.random() * 200);
    
    // Random boolean for whether current user has liked the post
    const userHasLiked = Math.random() > 0.5;
    
    return {
      ...post,
      user: postUser,
      likes: likeCount,
      comments: commentCount,
      userHasLiked,
    };
  }) || [];

  return (
    <div className="bg-[#F0F2F5] min-h-screen">
      <Header />
      
      <div className="pt-16 pb-16 md:pb-4">
        <div className="max-w-screen-lg mx-auto">
          {/* Cover and Profile Photo */}
          <div className="relative bg-white rounded-b-lg shadow">
            <div className="h-72 bg-[#F0F2F5] relative rounded-b-lg overflow-hidden">
              {user.coverPicture ? (
                <img 
                  src={user.coverPicture} 
                  alt="Cover" 
                  className="w-full h-full object-cover" 
                />
              ) : null}
              
              {isCurrentUser && (
                <button className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow text-[#1877F2]">
                  <Camera size={20} />
                </button>
              )}
            </div>
            
            <div className="flex flex-col md:flex-row items-center md:items-end px-4 md:px-8 -mt-20 pb-4 relative z-10">
              <div className="relative">
                <img 
                  src={user.profilePicture} 
                  alt={user.fullName} 
                  className="w-36 h-36 rounded-full border-4 border-white object-cover bg-white" 
                />
                
                {isCurrentUser && (
                  <button className="absolute bottom-3 right-3 bg-[#F0F2F5] p-2 rounded-full shadow text-[#1877F2]">
                    <Camera size={16} />
                  </button>
                )}
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between w-full mt-2 md:mt-0 md:ml-4 pb-4">
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold">{user.fullName}</h1>
                  <p className="text-[#65676B]">{user.bio || `Hi, I'm ${user.fullName}`}</p>
                </div>
                
                <div className="mt-4 md:mt-0 flex justify-center">
                  {isCurrentUser ? (
                    <button className="flex items-center gap-1 bg-[#F0F2F5] text-black font-medium px-4 py-2 rounded-md">
                      <Edit size={16} />
                      Edit Profile
                    </button>
                  ) : (
                    <button className="flex items-center gap-1 bg-[#1877F2] text-white font-medium px-4 py-2 rounded-md">
                      <Plus size={16} />
                      Add Friend
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="border-t border-[#E4E6EB] px-4">
              <div className="flex">
                <button className="px-4 py-3 font-medium text-[#1877F2] border-b-2 border-[#1877F2]">
                  Posts
                </button>
                <button className="px-4 py-3 font-medium text-[#65676B] hover:bg-[#F0F2F5] rounded-lg">
                  About
                </button>
                <button className="px-4 py-3 font-medium text-[#65676B] hover:bg-[#F0F2F5] rounded-lg">
                  Friends
                </button>
                <button className="px-4 py-3 font-medium text-[#65676B] hover:bg-[#F0F2F5] rounded-lg">
                  Photos
                </button>
              </div>
            </div>
          </div>
          
          {/* Posts Section */}
          <div className="mt-4 px-4 md:px-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Left column: Intro and Photos */}
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow p-4">
                  <h2 className="text-xl font-bold mb-3">Intro</h2>
                  <p className="text-[#65676B] mb-3">{user.bio || `Hi, I'm ${user.fullName}`}</p>
                  
                  {isCurrentUser && (
                    <button className="w-full py-2 bg-[#F0F2F5] rounded-md font-medium">
                      Edit Bio
                    </button>
                  )}
                </div>
                
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-bold">Photos</h2>
                    <a href="#" className="text-[#1877F2] text-sm">See All Photos</a>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                      <div key={i} className="aspect-square bg-[#F0F2F5] rounded-md overflow-hidden">
                        <img 
                          src={`https://picsum.photos/seed/${user.id + i}/200/200`} 
                          alt="Photo" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Right columns: Posts */}
              <div className="md:col-span-2 space-y-4">
                {/* Create Post */}
                {isCurrentUser && (
                  <div className="bg-white rounded-lg shadow p-3">
                    <div className="flex items-center space-x-2">
                      <img 
                        src={user.profilePicture} 
                        alt={user.fullName} 
                        className="w-10 h-10 rounded-full" 
                      />
                      <div className="bg-[#F0F2F5] rounded-full py-2 px-4 flex-1 text-[#65676B] cursor-pointer">
                        What's on your mind, {user.fullName.split(' ')[0]}?
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Posts */}
                {processedPosts.length > 0 ? (
                  processedPosts.map(post => (
                    <Post 
                      key={post.id} 
                      post={post} 
                      currentUserId={currentUserId}
                      showComments={expandedPosts.includes(post.id)} 
                      onToggleComments={() => toggleComments(post.id)}
                    />
                  ))
                ) : (
                  <div className="bg-white rounded-lg shadow p-8 text-center">
                    <h2 className="text-xl font-bold mb-2">No Posts Yet</h2>
                    <p className="text-[#65676B]">
                      {isCurrentUser 
                        ? "When you create posts, they'll appear here."
                        : `${user.fullName} hasn't posted anything yet.`
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <MobileNav />
    </div>
  );
};

export default ProfilePage;
