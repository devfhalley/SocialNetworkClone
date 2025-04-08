import { useQuery } from "@tanstack/react-query";
import { User } from "@/types";
import { Plus } from "lucide-react";

interface StoryData {
  id: number;
  user: User;
  imageUrl: string;
}

const Stories = () => {
  // In a real app, this would be based on authentication
  const currentUserId = 1;
  
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });
  
  const { data: currentUser } = useQuery<User>({
    queryKey: [`/api/users/${currentUserId}`],
  });
  
  if (isLoading || !users || !currentUser) {
    return (
      <div className="stories-container mb-4 pt-4">
        <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-hide">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="animate-pulse bg-gray-200 flex-shrink-0 w-28 h-48 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }
  
  // Create story data with mock images
  // In a real app, this would come from the API
  const storyImages = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=350",
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=350",
    "https://images.unsplash.com/photo-1523593288094-3ccfb6b2c306?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=350",
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=350"
  ];
  
  // Stories from other users (excluding the current user)
  const stories: StoryData[] = users
    .filter(user => user.id !== currentUserId)
    .slice(0, 4)
    .map((user, index) => ({
      id: index + 1,
      user,
      imageUrl: storyImages[index]
    }));

  return (
    <div className="stories-container mb-4 pt-4">
      <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-hide">
        {/* Create Story */}
        <div className="relative flex-shrink-0 w-28 h-48 rounded-xl overflow-hidden shadow-md bg-white cursor-pointer">
          <div className="h-3/4 flex-shrink-0 bg-[#F0F2F5] flex items-center justify-center">
            <img 
              src={currentUser.profilePicture} 
              alt={currentUser.fullName} 
              className="object-cover w-full h-full" 
            />
          </div>
          <div className="absolute w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center border-4 border-white" style={{ bottom: "28%", left: "50%", transform: "translateX(-50%)" }}>
            <Plus className="text-white" size={16} />
          </div>
          <div className="h-1/4 flex items-center justify-center">
            <span className="text-xs font-medium text-center px-1">Create Story</span>
          </div>
        </div>
        
        {/* Stories */}
        {stories.map(story => (
          <div key={story.id} className="relative flex-shrink-0 w-28 h-48 rounded-xl overflow-hidden shadow cursor-pointer">
            <img 
              src={story.imageUrl} 
              alt="Story" 
              className="object-cover w-full h-full" 
            />
            <div className="absolute top-2 left-2 w-9 h-9 rounded-full border-4 border-[#1877F2] overflow-hidden">
              <img 
                src={story.user.profilePicture} 
                alt={story.user.fullName} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="absolute bottom-2 left-2 right-2">
              <p className="text-white text-xs font-semibold">{story.user.fullName}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stories;
