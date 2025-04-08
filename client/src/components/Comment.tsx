import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { CommentWithUser, User } from "@/types";
import { Link } from "wouter";

interface CommentProps {
  comment: CommentWithUser;
}

const Comment = ({ comment }: CommentProps) => {
  const { data: commentUser, isLoading } = useQuery<User>({
    queryKey: [`/api/users/${comment.userId}`],
  });

  if (isLoading || !commentUser) {
    return (
      <div className="animate-pulse flex space-x-2">
        <div className="rounded-full bg-gray-200 h-8 w-8"></div>
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (e) {
      return "recently";
    }
  };

  return (
    <div className="flex space-x-2">
      <Link href={`/profile/${commentUser.id}`}>
        <a>
          <img 
            src={commentUser.profilePicture} 
            alt={commentUser.fullName} 
            className="w-8 h-8 rounded-full" 
          />
        </a>
      </Link>
      <div className="bg-[#F0F2F5] rounded-2xl py-2 px-3 max-w-xs">
        <Link href={`/profile/${commentUser.id}`}>
          <a className="font-semibold text-sm">{commentUser.fullName}</a>
        </Link>
        <p className="text-sm">{comment.content}</p>
        <div className="text-xs text-[#65676B] mt-1">
          {formatDate(comment.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default Comment;
