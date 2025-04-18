import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Globe, MoreHorizontal, ThumbsUp, MessageSquare, Share as ShareIcon, Heart, Smile, X } from "lucide-react";
import { PostWithUser, User, CommentWithUser } from "@/types";
import Comment from "./Comment";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface PostProps {
  post: PostWithUser;
  currentUserId: number;
  showComments: boolean;
  onToggleComments: () => void;
}

const Post = ({ post, currentUserId, showComments, onToggleComments }: PostProps) => {
  const [commentText, setCommentText] = useState("");
  const [isLiked, setIsLiked] = useState(post.userHasLiked);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareComment, setShareComment] = useState("");
  
  const { data: comments = [], isLoading: isLoadingComments } = useQuery<CommentWithUser[]>({
    queryKey: [`/api/posts/${post.id}/comments`],
    enabled: showComments,
  });
  
  const { data: currentUser } = useQuery<User>({
    queryKey: [`/api/users/${currentUserId}`],
  });

  const { data: shares = [], isLoading: isLoadingShares } = useQuery<any[]>({
    queryKey: [`/api/posts/${post.id}/shares`],
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (isLiked) {
        // In a real app, we would delete the specific like record
        // For now, this is a simplified toggle
        return await apiRequest('POST', '/api/likes', { 
          userId: currentUserId, 
          postId: post.id,
          type: 'like'
        });
      } else {
        return await apiRequest('POST', '/api/likes', { 
          userId: currentUserId, 
          postId: post.id,
          type: 'like'
        });
      }
    },
    onSuccess: () => {
      setIsLiked(!isLiked);
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${post.id}/likes`] });
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
    }
  });

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      return await apiRequest('POST', '/api/comments', {
        userId: currentUserId,
        postId: post.id,
        content
      });
    },
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${post.id}/comments`] });
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
    }
  });

  const shareMutation = useMutation({
    mutationFn: async (comment: string) => {
      return await apiRequest('POST', '/api/shares', {
        userId: currentUserId,
        postId: post.id,
        comment
      });
    },
    onSuccess: () => {
      setShareComment("");
      setShareDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${post.id}/shares`] });
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
    }
  });

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleComment = () => {
    onToggleComments();
  };

  const handleShare = () => {
    setShareDialogOpen(true);
  };

  const submitShare = () => {
    if (shareComment.trim() || true) { // Allow empty comments when sharing
      shareMutation.mutate(shareComment);
    }
  };

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      commentMutation.mutate(commentText);
    }
  };

  const formatDate = (date: Date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: false });
    } catch (e) {
      return "recently";
    }
  };

  const shareCount = shares?.length || post.shares || 0;

  return (
    <div className="bg-white rounded-lg shadow mb-4">
      <div className="p-3">
        <div className="flex items-center justify-between">
          <Link href={`/profile/${post.user.id}`}>
            <a className="flex items-center space-x-2">
              <img 
                src={post.user.profilePicture} 
                alt={post.user.fullName} 
                className="w-10 h-10 rounded-full" 
              />
              <div>
                <p className="font-semibold text-[#050505]">{post.user.fullName}</p>
                <p className="text-xs text-[#65676B]">
                  {formatDate(post.createdAt)} · <Globe size={12} className="inline" />
                </p>
              </div>
            </a>
          </Link>
          <div>
            <button className="p-2 hover:bg-[#F0F2F5] rounded-full">
              <MoreHorizontal className="text-[#65676B]" size={18} />
            </button>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-[#050505]">{post.content}</p>
        </div>
      </div>
      {post.imageUrl && (
        <div className="mt-1">
          <img 
            src={post.imageUrl} 
            alt="Post" 
            className="w-full" 
          />
        </div>
      )}
      <div className="p-3">
        <div className="flex justify-between text-[#65676B] text-sm pb-2 border-b border-[#E4E6EB]">
          <div className="flex items-center">
            <div className="flex -space-x-1">
              <div className="w-5 h-5 rounded-full bg-[#1877F2] flex items-center justify-center">
                <ThumbsUp className="text-white" size={10} />
              </div>
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                <Heart className="text-white" size={10} />
              </div>
            </div>
            <span className="ml-2">{post.likes}</span>
          </div>
          <div className="flex space-x-3">
            <span>{post.comments} comments</span>
            <span>{shareCount} shares</span>
          </div>
        </div>
        <div className="flex justify-between pt-2">
          <button 
            className={`flex-1 py-2 font-medium ${isLiked ? 'text-[#1877F2]' : 'text-[#65676B]'} hover:bg-[#F0F2F5] rounded-md`}
            onClick={handleLike}
            disabled={likeMutation.isPending}
          >
            {isLiked ? (
              <ThumbsUp className="mr-1 inline" size={16} />
            ) : (
              <ThumbsUp className="mr-1 inline" size={16} />
            )}
            Like
          </button>
          <button 
            className="flex-1 py-2 font-medium text-[#65676B] hover:bg-[#F0F2F5] rounded-md"
            onClick={handleComment}
          >
            <MessageSquare className="mr-1 inline" size={16} />
            Comment
          </button>
          <button 
            className="flex-1 py-2 font-medium text-[#65676B] hover:bg-[#F0F2F5] rounded-md"
            onClick={handleShare}
          >
            <ShareIcon className="mr-1 inline" size={16} />
            Share
          </button>
        </div>
        
        {/* Comments Section */}
        {showComments && (
          <div className="pt-3 border-t border-[#E4E6EB] mt-2">
            <div className="space-y-3">
              {isLoadingComments ? (
                <div className="animate-pulse flex space-x-2">
                  <div className="rounded-full bg-gray-200 h-8 w-8"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ) : comments && comments.length > 0 ? (
                comments.map((comment: any) => (
                  <Comment key={comment.id} comment={comment} />
                ))
              ) : (
                <p className="text-center text-[#65676B] text-sm py-2">No comments yet</p>
              )}
              
              {currentUser && (
                <form onSubmit={submitComment} className="flex space-x-2">
                  <img 
                    src={currentUser.profilePicture} 
                    alt={currentUser.fullName} 
                    className="w-8 h-8 rounded-full" 
                  />
                  <div className="flex-1 bg-[#F0F2F5] rounded-full flex items-center">
                    <input 
                      type="text" 
                      className="bg-transparent px-3 py-1 flex-1 focus:outline-none" 
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      disabled={commentMutation.isPending}
                    />
                    <div className="flex space-x-1 pr-3">
                      <button type="button" className="w-8 h-8 rounded-full hover:bg-gray-300 flex items-center justify-center">
                        <Smile size={16} />
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              Share Post
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <X size={16} />
                </Button>
              </DialogClose>
            </DialogTitle>
            <DialogDescription>
              Share this post with your friends
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              {currentUser && (
                <img 
                  src={currentUser.profilePicture} 
                  alt={currentUser.fullName} 
                  className="w-10 h-10 rounded-full mt-1" 
                />
              )}
              <div className="flex-1">
                {currentUser && (
                  <p className="font-medium">{currentUser.fullName}</p>
                )}
                <Textarea 
                  placeholder="What's on your mind?"
                  value={shareComment}
                  onChange={(e) => setShareComment(e.target.value)}
                  className="min-h-24 mt-2"
                />
              </div>
            </div>
            <div className="bg-[#F0F2F5] rounded-lg p-3 flex items-start space-x-3">
              <img 
                src={post.user.profilePicture} 
                alt={post.user.fullName} 
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium">{post.user.fullName}</p>
                <p className="text-xs text-[#65676B]">{formatDate(post.createdAt)}</p>
                <p className="mt-1 text-sm line-clamp-2">{post.content}</p>
                {post.imageUrl && (
                  <div className="mt-2 bg-gray-100 h-28 rounded overflow-hidden">
                    <img 
                      src={post.imageUrl} 
                      alt="Post" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}
              </div>
            </div>
            <Button 
              className="w-full bg-[#1877F2] hover:bg-[#166FE5]" 
              onClick={submitShare}
              disabled={shareMutation.isPending}
            >
              {shareMutation.isPending ? "Sharing..." : "Share Now"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Post;
