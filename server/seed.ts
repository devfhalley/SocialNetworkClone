import { db } from './db';
import {
  users,
  posts,
  likes,
  comments,
  friends
} from '@shared/schema';

export async function seedDatabase() {
  console.log('Seeding database with initial data...');
  
  try {
    // Check if we have any users already
    const existingUsers = await db.select().from(users);
    if (existingUsers.length > 0) {
      console.log('Database already has data, skipping seed');
      return;
    }

    // Add users
    const [user1] = await db.insert(users).values({
      username: "johndoe",
      password: "password123",
      fullName: "John Doe",
      profilePicture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200",
      bio: "Software Developer at Tech Co."
    }).returning();
    
    const [user2] = await db.insert(users).values({
      username: "sarahmiller",
      password: "password123",
      fullName: "Sarah Miller",
      profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200",
      bio: "Artist and Designer"
    }).returning();
    
    const [user3] = await db.insert(users).values({
      username: "alexjohnson",
      password: "password123",
      fullName: "Alex Johnson",
      profilePicture: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200",
      bio: "Travel Enthusiast"
    }).returning();
    
    const [user4] = await db.insert(users).values({
      username: "jenniferchen",
      password: "password123",
      fullName: "Jennifer Chen",
      profilePicture: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200",
      bio: "Fitness Trainer"
    }).returning();
    
    const [user5] = await db.insert(users).values({
      username: "michaelbrown",
      password: "password123",
      fullName: "Michael Brown",
      profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200",
      bio: "Software Engineer"
    }).returning();
    
    const [user6] = await db.insert(users).values({
      username: "jameswilson",
      password: "password123",
      fullName: "James Wilson",
      profilePicture: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200",
      bio: "Photographer"
    }).returning();

    // Add posts
    const [post1] = await db.insert(posts).values({
      userId: user2.id, // Sarah Miller
      content: "Just finished this painting today! So happy with how it turned out. What do you think? 🎨 #art #painting #creative",
      imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500"
    }).returning();

    const [post2] = await db.insert(posts).values({
      userId: user3.id, // Alex Johnson
      content: "Incredible hike at Grand Canyon this weekend! The views were absolutely breathtaking. Anyone else been there recently?",
      imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500"
    }).returning();

    const [post3] = await db.insert(posts).values({
      userId: user4.id, // Jennifer Chen
      content: "Just got these new sneakers! They're so comfortable and perfect for my morning runs. Best purchase I've made in a long time!",
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600"
    }).returning();

    const [post4] = await db.insert(posts).values({
      userId: user5.id, // Michael Brown
      content: "Big news! Just accepted a new job offer at Google! So excited to start this new chapter. Thank you to everyone who supported me through this journey!",
      imageUrl: null
    }).returning();

    // Add comments
    await db.insert(comments).values({
      userId: user5.id, // Michael Brown
      postId: post3.id, // Jennifer's post
      content: "Those look amazing! What brand are they?"
    });

    await db.insert(comments).values({
      userId: user2.id, // Sarah Miller
      postId: post3.id, // Jennifer's post
      content: "I have the same pair! They're great for long distances too!"
    });

    // Add likes
    await db.insert(likes).values({ userId: user1.id, postId: post1.id, type: "like" });
    await db.insert(likes).values({ userId: user2.id, postId: post2.id, type: "like" });
    await db.insert(likes).values({ userId: user3.id, postId: post3.id, type: "like" });
    await db.insert(likes).values({ userId: user4.id, postId: post4.id, type: "like" });
    await db.insert(likes).values({ userId: user5.id, postId: post1.id, type: "like" });
    await db.insert(likes).values({ userId: user6.id, postId: post2.id, type: "like" });
    
    // Add friend relationships
    await db.insert(friends).values({ userId: user1.id, friendId: user2.id, status: "accepted" });
    await db.insert(friends).values({ userId: user1.id, friendId: user3.id, status: "accepted" });
    await db.insert(friends).values({ userId: user1.id, friendId: user4.id, status: "accepted" });
    await db.insert(friends).values({ userId: user1.id, friendId: user5.id, status: "accepted" });
    await db.insert(friends).values({ userId: user6.id, friendId: user1.id, status: "pending" });

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}