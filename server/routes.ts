import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertPostSchema, insertLikeSchema, insertCommentSchema, insertFriendSchema, insertShareSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const newUser = await storage.createUser(userData);
      return res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Post routes
  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await storage.getAllPosts();
      return res.json(posts);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get("/api/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const post = await storage.getPost(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      return res.json(post);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  app.get("/api/users/:id/posts", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const posts = await storage.getUserPosts(userId);
      return res.json(posts);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch user posts" });
    }
  });

  app.post("/api/posts", async (req, res) => {
    try {
      const postData = insertPostSchema.parse(req.body);
      const newPost = await storage.createPost(postData);
      return res.status(201).json(newPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid post data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create post" });
    }
  });

  // Like routes
  app.get("/api/posts/:id/likes", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const likes = await storage.getLikes(postId);
      return res.json(likes);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch likes" });
    }
  });

  app.post("/api/likes", async (req, res) => {
    try {
      const likeData = insertLikeSchema.parse(req.body);
      const newLike = await storage.createLike(likeData);
      return res.status(201).json(newLike);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid like data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create like" });
    }
  });

  app.delete("/api/likes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid like ID" });
      }
      
      await storage.deleteLike(id);
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete like" });
    }
  });

  // Comment routes
  app.get("/api/posts/:id/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const comments = await storage.getComments(postId);
      return res.json(comments);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/comments", async (req, res) => {
    try {
      const commentData = insertCommentSchema.parse(req.body);
      const newComment = await storage.createComment(commentData);
      return res.status(201).json(newComment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // Friend routes
  app.get("/api/users/:id/friends", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const friends = await storage.getFriends(userId);
      return res.json(friends);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch friends" });
    }
  });

  app.get("/api/users/:id/friend-requests", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const friendRequests = await storage.getFriendRequests(userId);
      return res.json(friendRequests);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch friend requests" });
    }
  });

  app.post("/api/friends", async (req, res) => {
    try {
      const friendData = insertFriendSchema.parse(req.body);
      const newFriendRequest = await storage.sendFriendRequest(friendData);
      return res.status(201).json(newFriendRequest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid friend request data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to send friend request" });
    }
  });

  app.patch("/api/friends/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid friend request ID" });
      }
      
      const { status } = req.body;
      if (!status || !["accepted", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status. Must be 'accepted' or 'rejected'" });
      }
      
      const updatedFriendRequest = await storage.updateFriendRequest(id, status);
      if (!updatedFriendRequest) {
        return res.status(404).json({ message: "Friend request not found" });
      }
      
      return res.json(updatedFriendRequest);
    } catch (error) {
      return res.status(500).json({ message: "Failed to update friend request" });
    }
  });

  // Share routes
  app.get("/api/posts/:id/shares", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const shares = await storage.getShares(postId);
      return res.json(shares);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch shares" });
    }
  });

  app.get("/api/users/:id/shares", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const shares = await storage.getUserShares(userId);
      return res.json(shares);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch user shares" });
    }
  });

  app.post("/api/shares", async (req, res) => {
    try {
      const shareData = insertShareSchema.parse(req.body);
      const newShare = await storage.createShare(shareData);
      return res.status(201).json(newShare);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid share data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create share" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
