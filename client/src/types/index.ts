export interface User {
  id: number;
  username: string;
  fullName: string;
  profilePicture?: string;
  coverPicture?: string;
  bio?: string;
}

export interface Post {
  id: number;
  userId: number;
  content: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface PostWithUser extends Post {
  user: User;
  likes: number;
  comments: number;
  userHasLiked: boolean;
}

export interface Like {
  id: number;
  userId: number;
  postId: number;
  type: string;
}

export interface Comment {
  id: number;
  userId: number;
  postId: number;
  content: string;
  createdAt: Date;
}

export interface CommentWithUser extends Comment {
  user: User;
}

export interface Friend {
  id: number;
  userId: number;
  friendId: number;
  status: string;
}

export interface FriendRequest {
  id: number;
  userId: number;
  user: User;
  status: string;
}

export interface SidebarItem {
  icon: string;
  name: string;
  path?: string;
  color?: string;
}

export interface Story {
  id: number;
  userId: number;
  user: User;
  imageUrl: string;
}
