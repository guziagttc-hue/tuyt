import React from 'react';
import type { ShopPost } from '../types';
import { PublishIcon } from '../constants';

interface ShopPostCardProps {
 post: ShopPost;
 onClick: () => void;
}

const ShopPostCard: React.FC<ShopPostCardProps> = ({ post, onClick }) => (
  <button onClick={onClick} className="bg-[#1A1B20] rounded-xl overflow-hidden text-left w-full">
    <img src={post.imageUrls[0]} alt={post.title} className="w-full h-48 object-cover" />
    <div className="p-3">
      <h3 className="font-semibold text-white text-md truncate">{post.title}</h3>
      <p className="text-lg font-bold text-cyan-400">৳{post.price}</p>
      <div className="flex items-center gap-2 mt-3">
        <img src={post.seller.avatar} alt={post.seller.name} className="w-6 h-6 rounded-full" />
        <span className="text-sm text-gray-400">{post.seller.name}</span>
      </div>
    </div>
  </button>
);

interface ShopPageProps {
  posts: ShopPost[];
  onSelectPost: (post: ShopPost) => void;
  onGoToCreatePost: () => void;
}

const ShopPage: React.FC<ShopPageProps> = ({ posts, onSelectPost, onGoToCreatePost }) => {
  return (
    <div className="w-full h-full bg-[#0D0F13] overflow-y-auto pb-20">
      <header className="p-4 bg-[#1A1B20]/80 backdrop-blur-sm sticky top-0 z-20 flex items-center justify-center">
        <h1 className="text-xl font-bold text-white">Shop</h1>
      </header>
      <div className="p-4 grid grid-cols-2 gap-4">
        {posts.map(post => (
          <ShopPostCard key={post.id} post={post} onClick={() => onSelectPost(post)} />
        ))}
      </div>
       <button 
        onClick={onGoToCreatePost}
        className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 bg-gradient-to-tr from-cyan-400 to-purple-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-600/50 hover:scale-105 transition-transform"
        aria-label="Create new shop post"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default ShopPage;
