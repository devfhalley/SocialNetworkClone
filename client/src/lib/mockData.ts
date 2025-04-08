import { User, Post, Comment, Like, Friend } from "@/types";

export const mockUsers: User[] = [
  {
    id: 1,
    username: "johndoe",
    fullName: "John Doe",
    profilePicture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200",
    bio: "Software Developer at Tech Co."
  },
  {
    id: 2,
    username: "sarahmiller",
    fullName: "Sarah Miller",
    profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200",
    bio: "Artist and Designer"
  },
  {
    id: 3,
    username: "alexjohnson",
    fullName: "Alex Johnson",
    profilePicture: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200",
    bio: "Travel Enthusiast"
  },
  {
    id: 4,
    username: "jenniferchen",
    fullName: "Jennifer Chen",
    profilePicture: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200",
    bio: "Fitness Trainer"
  },
  {
    id: 5,
    username: "michaelbrown",
    fullName: "Michael Brown",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200",
    bio: "Software Engineer"
  },
  {
    id: 6,
    username: "jameswilson",
    fullName: "James Wilson",
    profilePicture: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200",
    bio: "Photographer"
  }
];

export const mockPosts: Post[] = [
  {
    id: 1,
    userId: 2, // Sarah Miller
    content: "Just finished this painting today! So happy with how it turned out. What do you think? 🎨 #art #painting #creative",
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
  },
  {
    id: 2,
    userId: 3, // Alex Johnson
    content: "Incredible hike at Grand Canyon this weekend! The views were absolutely breathtaking. Anyone else been there recently?",
    imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    id: 3,
    userId: 4, // Jennifer Chen
    content: "Just got these new sneakers! They're so comfortable and perfect for my morning runs. Best purchase I've made in a long time!",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    id: 4,
    userId: 5, // Michael Brown
    content: "Big news! Just accepted a new job offer at Google! So excited to start this new chapter. Thank you to everyone who supported me through this journey!",
    imageUrl: "",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
  }
];

export const mockComments: Comment[] = [
  {
    id: 1,
    userId: 5, // Michael Brown
    postId: 3, // Jennifer's post
    content: "Those look amazing! What brand are they?",
    createdAt: new Date(Date.now() - 23 * 60 * 60 * 1000) // 23 hours ago
  },
  {
    id: 2,
    userId: 2, // Sarah Miller
    postId: 3, // Jennifer's post
    content: "I have the same pair! They're great for long distances too!",
    createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000) // 22 hours ago
  }
];

export const mockLikes: Like[] = [
  { id: 1, userId: 1, postId: 1, type: "like" },
  { id: 2, userId: 2, postId: 2, type: "like" },
  { id: 3, userId: 3, postId: 3, type: "like" },
  { id: 4, userId: 4, postId: 4, type: "like" },
  { id: 5, userId: 5, postId: 1, type: "like" },
  { id: 6, userId: 6, postId: 2, type: "like" }
];

export const mockFriends: Friend[] = [
  { id: 1, userId: 1, friendId: 2, status: "accepted" },
  { id: 2, userId: 1, friendId: 3, status: "accepted" },
  { id: 3, userId: 1, friendId: 4, status: "accepted" },
  { id: 4, userId: 1, friendId: 5, status: "accepted" },
  { id: 5, userId: 6, friendId: 1, status: "pending" }
];
