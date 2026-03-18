import { supabase } from './supabaseClient';
import { User, Video, PhotoPost, ShopPost } from './types';

export const supabaseService = {
  async getProfile(uid: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data as User;
  },

  async createProfile(profile: Partial<User>): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .insert([profile]);
      
    if (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  },

  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
      
    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }
    return data as User[];
  },

  async getVideos(): Promise<Video[]> {
    const { data, error } = await supabase
      .from('videos')
      .select('*');
      
    if (error) {
      console.error('Error fetching videos:', error);
      return [];
    }
    return data as Video[];
  },

  async getPhotoPosts(): Promise<PhotoPost[]> {
    const { data, error } = await supabase
      .from('photo_posts')
      .select('*');
      
    if (error) {
      console.error('Error fetching photo posts:', error);
      return [];
    }
    return data as PhotoPost[];
  },

  async getShopPosts(): Promise<ShopPost[]> {
    const { data, error } = await supabase
      .from('shop_posts')
      .select('*');
      
    if (error) {
      console.error('Error fetching shop posts:', error);
      return [];
    }
    return data as ShopPost[];
  }
};
