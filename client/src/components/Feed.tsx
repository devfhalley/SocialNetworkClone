import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Stories from "./Stories";
import CreatePost from "./CreatePost";
import Post from "./Post";
import { Post as PostType, User, Like, Comment } from "@/types";

const Feed = () => {
  // In a real app, this would be based on authentication
  const currentUserId = 1;
  
  const { data: postsData, isLoading: isLoadingPosts } = useQuery<PostType[]>({
    queryKey: ['/api/posts'],
  });
  
  const { data: users, isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });
  
  const [expandedComments, setExpandedComments] = useState<number[]>([]);
  
  const toggleComments = (postId: number) => {
    setExpandedComments(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId) 
        : [...prev, postId]
    );
  };
  
  if (isLoadingPosts || isLoadingUsers) {
    return (
      <div className="w-full md:w-2/4 px-4 md:px-0 md:mx-4">
        <div className="animate-pulse bg-white rounded-lg h-48 mb-4 mt-4"></div>
        <div className="animate-pulse bg-white rounded-lg h-24 mb-4"></div>
        <div className="animate-pulse bg-white rounded-lg h-80 mb-4"></div>
        <div className="animate-pulse bg-white rounded-lg h-80 mb-4"></div>
      </div>
    );
  }
  
  if (!postsData || !users) {
    return (
      <div className="w-full md:w-2/4 px-4 md:px-0 md:mx-4">
        <div className="bg-white rounded-lg p-4 text-center">
          Failed to load feed content
        </div>
      </div>
    );
  }
  
  // Pre-process post data for display
  const processedPosts = postsData.map(post => {
    const postUser = users.find(user => user.id === post.userId);
    
    // In a real app, we would fetch actual like and comment count
    // Here, we'll simulate it from our local data
    const likeCount = Math.floor(Math.random() * 1000);
    const commentCount = Math.floor(Math.random() * 200);
    
    // Random boolean for whether current user has liked the post
    const userHasLiked = Math.random() > 0.5;
    
    return {
      ...post,
      user: postUser || { 
        id: 0, 
        username: "unknown", 
        fullName: "Unknown User",
        profilePicture: "https://via.placeholder.com/40"
      },
      likes: likeCount,
      comments: commentCount,
      userHasLiked,
    };
  });

  return (
    <div className="w-full md:w-2/4 px-4 md:px-0 md:mx-4">
      {/* Stories and Reels */}
      <Stories />
      
      {/* Create Post */}
      <CreatePost currentUserId={currentUserId} currentUser={users.find(user => user.id === currentUserId)} />
      
      {/* Feed Posts */}
      {processedPosts.map(post => (
        <Post 
          key={post.id} 
          post={post} 
          currentUserId={currentUserId}
          showComments={expandedComments.includes(post.id)} 
          onToggleComments={() => toggleComments(post.id)}
        />
      ))}
    </div>
  );
};

export default Feed;
