import React from 'react';
import PhotoPostCard from './PhotoPostCard';
import type { PhotoPost } from '../types';

interface PhotoFeedPageProps {
  posts: PhotoPost[];
  onReactionSelect: (postId: number, reaction: string) => void;
}

const PhotoFeedPage: React.FC<PhotoFeedPageProps> = ({ posts, onReactionSelect }) => {
  return (
    <div className="w-full h-full bg-[#0D0F13] overflow-y-auto pb-20">
      <header className="p-4 bg-[#1A1B20]/80 backdrop-blur-sm sticky top-0 z-20 flex items-center justify-center">
        <h1 className="text-xl font-bold text-white">Photos</h1>
      </header>
      <div className="max-w-xl mx-auto pt-4">
        {posts.map(post => (
          <PhotoPostCard key={post.id} post={post} onReactionSelect={onReactionSelect} />
        ))}
        {posts.length === 0 && (
             <div className="text-center py-20 text-gray-500">
                <p>No photo posts yet.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default PhotoFeedPage;