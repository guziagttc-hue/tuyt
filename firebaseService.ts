import { db, auth } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  addDoc,
  serverTimestamp,
  DocumentData,
  QuerySnapshot
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import type { User, Video, PhotoPost, ShopPost, Comment } from './types';

export const firebaseService = {
  // Profiles
  async getProfile(userId: string): Promise<User | null> {
    const docRef = doc(db, 'profiles', userId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    return {
      id: docSnap.id,
      username: data.username,
      name: data.name || data.username,
      avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
      bio: data.bio || '',
      coverPhoto: data.coverPhoto || 'https://picsum.photos/seed/cover/1200/400',
      stats: data.stats || { observers: 0, observing: 0, totalViews: 0, joined: 'Just now' },
      observing: data.observing || []
    };
  },

  async getAllUsers(): Promise<User[]> {
    const querySnapshot = await getDocs(collection(db, 'profiles'));
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        username: data.username,
        name: data.name || data.username,
        avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
        bio: data.bio || '',
        coverPhoto: data.coverPhoto || 'https://picsum.photos/seed/cover/1200/400',
        stats: data.stats || { observers: 0, observing: 0, totalViews: 0, joined: 'Just now' },
        observing: data.observing || []
      };
    });
  },

  async createProfile(profile: { id: string; username: string; name: string }) {
    const profileData = {
      username: profile.username,
      name: profile.name,
      stats: { observers: 0, observing: 0, totalViews: 0, joined: new Date().toLocaleDateString() },
      observing: [],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`,
      bio: '',
      coverPhoto: 'https://picsum.photos/seed/cover/1200/400'
    };
    await setDoc(doc(db, 'profiles', profile.id), profileData);
    return { id: profile.id, ...profileData };
  },

  async updateProfile(userId: string, profile: Partial<User>) {
    const docRef = doc(db, 'profiles', userId);
    await updateDoc(docRef, profile as any);
  },

  // Auth
  async signOut() {
    await signOut(auth);
  },

  // Videos
  async getVideos(): Promise<Video[]> {
    const querySnapshot = await getDocs(collection(db, 'videos'));
    const videos = await Promise.all(querySnapshot.docs.map(async (videoDoc) => {
      const videoData = videoDoc.data();
      const userProfile = await this.getProfile(videoData.user_id);
      return {
        id: videoDoc.id as any,
        user: userProfile!,
        title: videoData.title,
        caption: videoData.caption,
        videoUrl: videoData.videoUrl,
        posterUrl: videoData.posterUrl,
        hashtags: videoData.hashtags || [],
        likes: videoData.likes || 0,
        comments: videoData.comments || 0,
        shares: videoData.shares || 0
      } as Video;
    }));
    return videos;
  },

  async uploadVideo(video: Omit<Video, 'id'>) {
    const { user, ...rest } = video;
    await addDoc(collection(db, 'videos'), {
      ...rest,
      user_id: user.id,
      createdAt: serverTimestamp()
    });
  },

  // Photo Posts
  async getPhotoPosts(): Promise<PhotoPost[]> {
    const querySnapshot = await getDocs(collection(db, 'photo_posts'));
    const posts = await Promise.all(querySnapshot.docs.map(async (postDoc) => {
      const postData = postDoc.data();
      const userProfile = await this.getProfile(postData.user_id);
      return {
        id: postDoc.id as any,
        user: userProfile!,
        timestamp: postData.timestamp,
        caption: postData.caption,
        imageUrl: postData.imageUrl,
        stats: postData.stats || { likes: 0, comments: 0, shares: 0, views: 0 }
      } as PhotoPost;
    }));
    return posts;
  },

  // Shop Posts
  async getShopPosts(): Promise<ShopPost[]> {
    const querySnapshot = await getDocs(collection(db, 'shop_posts'));
    const posts = await Promise.all(querySnapshot.docs.map(async (postDoc) => {
      const postData = postDoc.data();
      const sellerProfile = await this.getProfile(postData.seller_id);
      return {
        id: postDoc.id as any,
        seller: sellerProfile!,
        title: postData.title,
        price: postData.price,
        imageUrls: postData.imageUrls || [postData.imageUrl],
        description: postData.description,
        category: postData.category,
        condition: postData.condition || 'New',
        location: postData.location || 'Unknown',
        deliveryOption: postData.deliveryOption || 'Standard',
        deliveryCharge: postData.deliveryCharge || 'Separate',
        rating: postData.rating,
        reviews: postData.reviews || [],
        views: postData.views || 0
      } as ShopPost;
    }));
    return posts;
  },

  // Comments
  async getComments(videoId: string): Promise<Comment[]> {
    const q = query(collection(db, 'comments'), where('video_id', '==', videoId));
    const querySnapshot = await getDocs(q);
    const comments = await Promise.all(querySnapshot.docs.map(async (commentDoc) => {
      const commentData = commentDoc.data();
      const userProfile = await this.getProfile(commentData.user_id);
      return {
        id: commentDoc.id as any,
        user: userProfile!,
        text: commentData.text,
        timestamp: commentData.timestamp,
        likes: commentData.likes || 0,
        isLikedByMe: false,
        replies: []
      } as Comment;
    }));
    return comments;
  },

  async addComment(comment: Omit<Comment, 'id'> & { video_id: string }) {
    const { user, ...rest } = comment;
    await addDoc(collection(db, 'comments'), {
      ...rest,
      user_id: user.id,
      createdAt: serverTimestamp()
    });
  }
};
