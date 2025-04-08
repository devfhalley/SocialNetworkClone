import { useState } from "react";
import { User } from "@/types";
import { Video, Image, Smile } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CreatePostProps {
  currentUserId: number;
  currentUser?: User;
}

const CreatePost = ({ currentUserId, currentUser }: CreatePostProps) => {
  const [postContent, setPostContent] = useState("");
  const { toast } = useToast();
  
  const createPostMutation = useMutation({
    mutationFn: async ({ userId, content }: { userId: number, content: string }) => {
      return apiRequest('POST', '/api/posts', { userId, content, imageUrl: "" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      setPostContent("");
      toast({
        title: "Post created",
        description: "Your post has been published.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (postContent.trim()) {
      createPostMutation.mutate({ userId: currentUserId, content: postContent });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow mb-4 p-3">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center space-x-2">
          <img 
            src={currentUser?.profilePicture} 
            alt={currentUser?.fullName || "User"} 
            className="w-10 h-10 rounded-full" 
          />
          <input 
            type="text" 
            className="bg-[#F0F2F5] rounded-full py-2 px-4 flex-1 text-gray-700 focus:outline-none" 
            placeholder={`What's on your mind, ${currentUser?.fullName.split(' ')[0] || "User"}?`}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
          <button 
            type="submit" 
            className={`hidden ${postContent.trim() ? 'md:block' : 'md:hidden'} bg-[#1877F2] text-white px-4 py-2 rounded-md`}
            disabled={createPostMutation.isPending || !postContent.trim()}
          >
            Post
          </button>
        </div>
        <div className="border-t border-[#E4E6EB] mt-3 pt-3">
          <div className="flex justify-between">
            <button type="button" className="flex items-center justify-center flex-1 py-2 rounded-lg hover:bg-[#F0F2F5]">
              <Video className="text-red-500 mr-2" size={18} />
              <span className="text-[#65676B] font-medium">Live video</span>
            </button>
            <button type="button" className="flex items-center justify-center flex-1 py-2 rounded-lg hover:bg-[#F0F2F5]">
              <Image className="text-green-500 mr-2" size={18} />
              <span className="text-[#65676B] font-medium">Photo/video</span>
            </button>
            <button type="button" className="flex items-center justify-center flex-1 py-2 rounded-lg hover:bg-[#F0F2F5]">
              <Smile className="text-yellow-500 mr-2" size={18} />
              <span className="text-[#65676B] font-medium">Feeling/activity</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
