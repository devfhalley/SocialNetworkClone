import { 
  users, 
  User, 
  InsertUser, 
  posts, 
  Post, 
  InsertPost, 
  likes, 
  Like, 
  InsertLike, 
  comments, 
  Comment, 
  InsertComment,
  friends,
  Friend,
  InsertFriend,
  shares,
  Share,
  InsertShare
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  
  // Friend operations
  getFriendRequests(userId: number): Promise<Friend[]>;
  getFriends(userId: number): Promise<Friend[]>;
  sendFriendRequest(request: InsertFriend): Promise<Friend>;
  updateFriendRequest(id: number, status: string): Promise<Friend | undefined>;
  
  // Post operations
  getPost(id: number): Promise<Post | undefined>;
  getAllPosts(): Promise<Post[]>;
  getUserPosts(userId: number): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  
  // Like operations
  getLikes(postId: number): Promise<Like[]>;
  getLike(userId: number, postId: number): Promise<Like | undefined>;
  createLike(like: InsertLike): Promise<Like>;
  deleteLike(id: number): Promise<void>;
  
  // Comment operations
  getComments(postId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  
  // Share operations
  getShares(postId: number): Promise<Share[]>;
  getUserShares(userId: number): Promise<Share[]>;
  createShare(share: InsertShare): Promise<Share>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private posts: Map<number, Post>;
  private likes: Map<number, Like>;
  private comments: Map<number, Comment>;
  private friends: Map<number, Friend>;
  private shares: Map<number, Share>;
  
  private currentUserId: number;
  private currentPostId: number;
  private currentLikeId: number;
  private currentCommentId: number;
  private currentFriendId: number;
  private currentShareId: number;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.likes = new Map();
    this.comments = new Map();
    this.friends = new Map();
    this.shares = new Map();
    
    this.currentUserId = 1;
    this.currentPostId = 1;
    this.currentLikeId = 1;
    this.currentCommentId = 1;
    this.currentFriendId = 1;
    this.currentShareId = 1;
    
    // Seed some initial data
    this.seedData();
  }

  private seedData() {
    // Add users
    const user1 = this.createUser({ 
      username: "johndoe", 
      password: "password123", 
      fullName: "John Doe",
      profilePicture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200",
      bio: "Software Developer at Tech Co."
    });
    
    const user2 = this.createUser({ 
      username: "sarahmiller", 
      password: "password123", 
      fullName: "Sarah Miller",
      profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200",
      bio: "Artist and Designer"
    });
    
    const user3 = this.createUser({ 
      username: "alexjohnson", 
      password: "password123", 
      fullName: "Alex Johnson",
      profilePicture: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200",
      bio: "Travel Enthusiast"
    });
    
    const user4 = this.createUser({ 
      username: "jenniferchen", 
      password: "password123", 
      fullName: "Jennifer Chen",
      profilePicture: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200",
      bio: "Fitness Trainer"
    });
    
    const user5 = this.createUser({ 
      username: "michaelbrown", 
      password: "password123", 
      fullName: "Michael Brown",
      profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200",
      bio: "Software Engineer"
    });
    
    const user6 = this.createUser({ 
      username: "jameswilson", 
      password: "password123", 
      fullName: "James Wilson",
      profilePicture: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200",
      bio: "Photographer"
    });

    // Add posts
    this.createPost({
      userId: 2, // Sarah Miller
      content: "Just finished this painting today! So happy with how it turned out. What do you think? 🎨 #art #painting #creative",
      imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500"
    });

    this.createPost({
      userId: 3, // Alex Johnson
      content: "Incredible hike at Grand Canyon this weekend! The views were absolutely breathtaking. Anyone else been there recently?",
      imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500"
    });

    this.createPost({
      userId: 4, // Jennifer Chen
      content: "Just got these new sneakers! They're so comfortable and perfect for my morning runs. Best purchase I've made in a long time!",
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600"
    });

    this.createPost({
      userId: 5, // Michael Brown
      content: "Big news! Just accepted a new job offer at Google! So excited to start this new chapter. Thank you to everyone who supported me through this journey!",
      imageUrl: ""
    });

    // Add comments
    this.createComment({
      userId: 5, // Michael Brown
      postId: 3, // Jennifer's post
      content: "Those look amazing! What brand are they?"
    });

    this.createComment({
      userId: 2, // Sarah Miller
      postId: 3, // Jennifer's post
      content: "I have the same pair! They're great for long distances too!"
    });

    // Add likes
    this.createLike({ userId: 1, postId: 1, type: "like" });
    this.createLike({ userId: 2, postId: 2, type: "like" });
    this.createLike({ userId: 3, postId: 3, type: "like" });
    this.createLike({ userId: 4, postId: 4, type: "like" });
    this.createLike({ userId: 5, postId: 1, type: "like" });
    this.createLike({ userId: 6, postId: 2, type: "like" });
    
    // Add friend relationships
    this.sendFriendRequest({ userId: 1, friendId: 2, status: "accepted" });
    this.sendFriendRequest({ userId: 1, friendId: 3, status: "accepted" });
    this.sendFriendRequest({ userId: 1, friendId: 4, status: "accepted" });
    this.sendFriendRequest({ userId: 1, friendId: 5, status: "accepted" });
    this.sendFriendRequest({ userId: 6, friendId: 1, status: "pending" });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Friend operations
  async getFriendRequests(userId: number): Promise<Friend[]> {
    return Array.from(this.friends.values()).filter(
      friend => friend.friendId === userId && friend.status === "pending"
    );
  }

  async getFriends(userId: number): Promise<Friend[]> {
    return Array.from(this.friends.values()).filter(
      friend => 
        (friend.userId === userId || friend.friendId === userId) && 
        friend.status === "accepted"
    );
  }

  async sendFriendRequest(request: InsertFriend): Promise<Friend> {
    const id = this.currentFriendId++;
    const friendRequest: Friend = { ...request, id };
    this.friends.set(id, friendRequest);
    return friendRequest;
  }

  async updateFriendRequest(id: number, status: string): Promise<Friend | undefined> {
    const friendRequest = this.friends.get(id);
    if (!friendRequest) return undefined;
    
    const updatedRequest: Friend = { ...friendRequest, status };
    this.friends.set(id, updatedRequest);
    return updatedRequest;
  }

  // Post operations
  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async getAllPosts(): Promise<Post[]> {
    return Array.from(this.posts.values()).sort((a, b) => 
      (new Date(b.createdAt as Date)).getTime() - (new Date(a.createdAt as Date)).getTime()
    );
  }

  async getUserPosts(userId: number): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.userId === userId)
      .sort((a, b) => 
        (new Date(b.createdAt as Date)).getTime() - (new Date(a.createdAt as Date)).getTime()
      );
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.currentPostId++;
    const post: Post = { 
      ...insertPost, 
      id,
      createdAt: new Date() 
    };
    this.posts.set(id, post);
    return post;
  }

  // Like operations
  async getLikes(postId: number): Promise<Like[]> {
    return Array.from(this.likes.values()).filter(like => like.postId === postId);
  }

  async getLike(userId: number, postId: number): Promise<Like | undefined> {
    return Array.from(this.likes.values()).find(
      like => like.userId === userId && like.postId === postId
    );
  }

  async createLike(insertLike: InsertLike): Promise<Like> {
    // Check if the user already liked the post
    const existingLike = await this.getLike(insertLike.userId, insertLike.postId);
    if (existingLike) {
      return existingLike;
    }
    
    const id = this.currentLikeId++;
    const like: Like = { ...insertLike, id };
    this.likes.set(id, like);
    return like;
  }

  async deleteLike(id: number): Promise<void> {
    this.likes.delete(id);
  }

  // Comment operations
  async getComments(postId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => 
        (new Date(a.createdAt as Date)).getTime() - (new Date(b.createdAt as Date)).getTime()
      );
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.currentCommentId++;
    const comment: Comment = { 
      ...insertComment, 
      id,
      createdAt: new Date() 
    };
    this.comments.set(id, comment);
    return comment;
  }

  // Share operations
  async getShares(postId: number): Promise<Share[]> {
    return Array.from(this.shares.values())
      .filter(share => share.postId === postId)
      .sort((a, b) => 
        (new Date(b.createdAt as Date)).getTime() - (new Date(a.createdAt as Date)).getTime()
      );
  }

  async getUserShares(userId: number): Promise<Share[]> {
    return Array.from(this.shares.values())
      .filter(share => share.userId === userId)
      .sort((a, b) => 
        (new Date(b.createdAt as Date)).getTime() - (new Date(a.createdAt as Date)).getTime()
      );
  }

  async createShare(insertShare: InsertShare): Promise<Share> {
    const id = this.currentShareId++;
    const share: Share = { 
      ...insertShare, 
      id,
      createdAt: new Date() 
    };
    this.shares.set(id, share);
    return share;
  }
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Ensure all fields are properly formatted for database
    const userToInsert = {
      ...insertUser,
      profilePicture: insertUser.profilePicture ?? null,
      coverPicture: insertUser.coverPicture ?? null,
      bio: insertUser.bio ?? null
    };
    
    const [user] = await db.insert(users).values(userToInsert).returning();
    return user;
  }

  // Friend operations
  async getFriendRequests(userId: number): Promise<Friend[]> {
    return await db.select()
      .from(friends)
      .where(and(
        eq(friends.friendId, userId),
        eq(friends.status, "pending")
      ));
  }

  async getFriends(userId: number): Promise<Friend[]> {
    return await db.select()
      .from(friends)
      .where(and(
        or(eq(friends.userId, userId), eq(friends.friendId, userId)),
        eq(friends.status, "accepted")
      ));
  }

  async sendFriendRequest(request: InsertFriend): Promise<Friend> {
    const [friendRequest] = await db.insert(friends).values(request).returning();
    return friendRequest;
  }

  async updateFriendRequest(id: number, status: string): Promise<Friend | undefined> {
    const [updatedRequest] = await db
      .update(friends)
      .set({ status })
      .where(eq(friends.id, id))
      .returning();
    return updatedRequest;
  }

  // Post operations
  async getPost(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post;
  }

  async getAllPosts(): Promise<Post[]> {
    return await db.select()
      .from(posts)
      .orderBy(desc(posts.createdAt));
  }

  async getUserPosts(userId: number): Promise<Post[]> {
    return await db.select()
      .from(posts)
      .where(eq(posts.userId, userId))
      .orderBy(desc(posts.createdAt));
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    // Ensure all fields are properly formatted for database
    const postToInsert = {
      ...insertPost,
      imageUrl: insertPost.imageUrl ?? null
    };
    
    const [post] = await db.insert(posts).values(postToInsert).returning();
    return post;
  }

  // Like operations
  async getLikes(postId: number): Promise<Like[]> {
    return await db.select()
      .from(likes)
      .where(eq(likes.postId, postId));
  }

  async getLike(userId: number, postId: number): Promise<Like | undefined> {
    const [like] = await db.select()
      .from(likes)
      .where(and(
        eq(likes.userId, userId),
        eq(likes.postId, postId)
      ));
    return like;
  }

  async createLike(insertLike: InsertLike): Promise<Like> {
    // Check if the user already liked the post
    const existingLike = await this.getLike(insertLike.userId, insertLike.postId);
    if (existingLike) {
      return existingLike;
    }
    
    // Ensure type field is set
    const likeToInsert = {
      ...insertLike,
      type: insertLike.type ?? "like"
    };
    
    const [like] = await db.insert(likes).values(likeToInsert).returning();
    return like;
  }

  async deleteLike(id: number): Promise<void> {
    await db.delete(likes).where(eq(likes.id, id));
  }

  // Comment operations
  async getComments(postId: number): Promise<Comment[]> {
    return await db.select()
      .from(comments)
      .where(eq(comments.postId, postId))
      .orderBy(asc(comments.createdAt));
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const [comment] = await db.insert(comments).values(insertComment).returning();
    return comment;
  }

  // Share operations
  async getShares(postId: number): Promise<Share[]> {
    return await db.select()
      .from(shares)
      .where(eq(shares.postId, postId))
      .orderBy(desc(shares.createdAt));
  }

  async getUserShares(userId: number): Promise<Share[]> {
    return await db.select()
      .from(shares)
      .where(eq(shares.userId, userId))
      .orderBy(desc(shares.createdAt));
  }

  async createShare(insertShare: InsertShare): Promise<Share> {
    // Ensure comment field is properly formatted for database
    const shareToInsert = {
      ...insertShare,
      comment: insertShare.comment ?? null
    };
    
    const [share] = await db.insert(shares).values(shareToInsert).returning();
    return share;
  }
}

// Use DatabaseStorage instead of MemStorage
export const storage = new DatabaseStorage();
